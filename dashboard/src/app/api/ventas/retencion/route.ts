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
      WITH customer_orders AS (
        SELECT
          email,
          id as order_id,
          created_at,
          total_price,
          financial_status,
          ROW_NUMBER() OVER (PARTITION BY email ORDER BY created_at ASC) as order_rank
        FROM \`${PROJECT}.ecommerce_data.shopify_orders\`
        WHERE financial_status IN ('paid', 'partially_refunded')
          AND email IS NOT NULL AND email != ''
      ),
      period_orders AS (
        SELECT
          co.*,
          CASE WHEN order_rank = 1 THEN 'new' ELSE 'returning' END as customer_type
        FROM customer_orders co
        WHERE DATE(co.created_at) BETWEEN @startDate AND @endDate
      )
      SELECT
        customer_type,
        COUNT(DISTINCT email) as customers,
        COUNT(order_id) as orders,
        SUM(total_price) as revenue
      FROM period_orders
      GROUP BY customer_type
    `;

    const [rows] = await bigquery.query({ query, params: { startDate, endDate } });

    const result = { new: { customers: 0, orders: 0, revenue: 0 }, returning: { customers: 0, orders: 0, revenue: 0 } };
    for (const row of rows) {
      const t = row.customer_type as 'new' | 'returning';
      if (t === 'new' || t === 'returning') {
        result[t] = {
          customers: parseInt(String(row.customers), 10) || 0,
          orders: parseInt(String(row.orders), 10) || 0,
          revenue: parseFloat(String(row.revenue)) || 0,
        };
      }
    }

    const totalRevenue = result.new.revenue + result.returning.revenue;
    const totalCustomers = result.new.customers + result.returning.customers;

    return NextResponse.json({
      success: true,
      data: {
        new: { ...result.new, revenueShare: totalRevenue > 0 ? (result.new.revenue / totalRevenue) * 100 : 0 },
        returning: { ...result.returning, revenueShare: totalRevenue > 0 ? (result.returning.revenue / totalRevenue) * 100 : 0 },
        totals: { customers: totalCustomers, revenue: totalRevenue },
        retentionRate: totalCustomers > 0 ? (result.returning.customers / totalCustomers) * 100 : 0,
        dateRange: { startDate, endDate },
      },
    });
  } catch (error: unknown) {
    console.error('Error fetching retencion:', error);
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
