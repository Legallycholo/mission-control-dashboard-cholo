import { NextResponse } from 'next/server';
import { BigQuery } from '@google-cloud/bigquery';

const bigquery = new BigQuery({ projectId: process.env.GCP_PROJECT_ID });
const PROJECT = process.env.GCP_PROJECT_ID;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);

    const startDate = searchParams.get('startDate') || firstDay.toISOString().split('T')[0];
    const endDate = searchParams.get('endDate') || now.toISOString().split('T')[0];

    const query = `
      SELECT
        COALESCE(li.product_type, 'Sin categoría') as category,
        COUNT(DISTINCT o.id) as orders,
        SUM(li.quantity) as units_sold,
        SUM(li.price * li.quantity) as revenue,
        SUM(COALESCE(li.total_discount, 0)) as discounts
      FROM \`${PROJECT}.ecommerce_data.shopify_order_line_items\` li
      JOIN \`${PROJECT}.ecommerce_data.shopify_orders\` o ON li.order_id = o.id
      WHERE DATE(o.created_at) BETWEEN @startDate AND @endDate
        AND o.financial_status IN ('paid', 'partially_refunded')
      GROUP BY category
      ORDER BY revenue DESC
      LIMIT 20
    `;

    const [rows] = await bigquery.query({
      query,
      params: { startDate, endDate },
    });

    const categories = rows.map(r => ({
      category: r.category,
      orders: parseInt(String(r.orders), 10) || 0,
      unitsSold: parseInt(String(r.units_sold), 10) || 0,
      revenue: parseFloat(String(r.revenue)) || 0,
      discounts: parseFloat(String(r.discounts)) || 0,
    }));

    const totalRevenue = categories.reduce((s, c) => s + c.revenue, 0);
    const enriched = categories.map(c => ({
      ...c,
      revenueShare: totalRevenue > 0 ? (c.revenue / totalRevenue) * 100 : 0,
    }));

    return NextResponse.json({ success: true, data: { categories: enriched, totalRevenue, dateRange: { startDate, endDate } } });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    const isNotFound = msg.includes('Not found') || msg.includes('does not exist');
    if (isNotFound) {
      return NextResponse.json({ success: false, error: 'table_not_found', message: 'La tabla shopify_order_line_items no existe aún en BigQuery.' });
    }
    console.error('Error fetching categorias:', error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
