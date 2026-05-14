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

    const [rows] = await bigquery.query({
      query: `
        SELECT
          COALESCE(payment_gateway, 'unknown') as gateway,
          COUNT(id) as orders,
          SUM(total_price) as revenue,
          AVG(total_price) as avg_order_value
        FROM \`${PROJECT}.ecommerce_data.shopify_orders\`
        WHERE DATE(created_at) BETWEEN @startDate AND @endDate
          AND financial_status IN ('paid', 'partially_refunded')
        GROUP BY gateway
        ORDER BY revenue DESC
      `,
      params: { startDate, endDate },
    });

    const gateways = rows.map(r => ({
      gateway: r.gateway,
      orders: parseInt(String(r.orders), 10) || 0,
      revenue: parseFloat(String(r.revenue)) || 0,
      avgOrderValue: parseFloat(String(r.avg_order_value)) || 0,
    }));

    const totalRevenue = gateways.reduce((s, g) => s + g.revenue, 0);
    const enriched = gateways.map(g => ({ ...g, revenueShare: totalRevenue > 0 ? (g.revenue / totalRevenue) * 100 : 0 }));

    return NextResponse.json({ success: true, data: { gateways: enriched, totalRevenue, dateRange: { startDate, endDate } } });
  } catch (error: unknown) {
    console.error('Error fetching metodo-pago:', error);
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
