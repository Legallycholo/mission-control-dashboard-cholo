import { NextResponse } from 'next/server';
import { BigQuery } from '@google-cloud/bigquery';
import { getPreviousPeriod, calcDelta } from '@/lib/period-compare';

const bigquery = new BigQuery({ projectId: process.env.GCP_PROJECT_ID });
const TABLE = `\`${process.env.GCP_PROJECT_ID}.ecommerce_data.shopify_orders\``;

function buildKpiQuery(start: Date, end: Date) {
  return {
    query: `
      SELECT
        SUM(total_price) as gross_sales,
        SUM(CASE WHEN financial_status IN ('paid', 'partially_refunded') THEN total_price ELSE 0 END) as net_sales,
        COUNT(id) as gross_order_count,
        COUNT(CASE WHEN financial_status IN ('paid', 'partially_refunded') THEN id END) as net_order_count,
        SUM(total_discounts) as total_discounts,
        SUM(CASE WHEN financial_status IN ('paid', 'partially_refunded') THEN total_discounts ELSE 0 END) as net_discounts
      FROM ${TABLE}
      WHERE created_at >= @startDate AND created_at <= @endDate
    `,
    params: { startDate: start.toISOString(), endDate: end.toISOString() },
  };
}

function parseKpiRow(row: Record<string, unknown>, diffDays: number) {
  const grossSales = parseFloat(String(row.gross_sales)) || 0;
  const netSales = parseFloat(String(row.net_sales)) || 0;
  const grossOrderCount = parseInt(String(row.gross_order_count), 10) || 0;
  const netOrderCount = parseInt(String(row.net_order_count), 10) || 0;
  const totalDiscounts = parseFloat(String(row.total_discounts)) || 0;
  const netDiscounts = parseFloat(String(row.net_discounts)) || 0;
  const aov = netOrderCount > 0 ? netSales / netOrderCount : 0;
  const averageDailySales = netSales / Math.max(1, diffDays);
  return { grossSales, netSales, grossOrderCount, netOrderCount, totalDiscounts, netDiscounts, aov, averageDailySales };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');
    const startDate = (startDateParam && !isNaN(Date.parse(startDateParam))) ? new Date(startDateParam) : firstDayOfMonth;
    const endDate = (endDateParam && !isNaN(Date.parse(endDateParam))) ? new Date(endDateParam) : now;

    const diffMs = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

    const { prevStart, prevEnd } = getPreviousPeriod(startDate, endDate);
    const prevDiffDays = Math.max(1, Math.ceil(Math.abs(prevEnd.getTime() - prevStart.getTime()) / (1000 * 60 * 60 * 24)));

    const trendQuery = {
      query: `
        SELECT
          CAST(DATE(created_at) AS STRING) as date,
          SUM(CASE WHEN financial_status IN ('paid', 'partially_refunded') THEN total_price ELSE 0 END) as net_sales,
          SUM(total_price) as gross_sales,
          COUNT(id) as orders
        FROM ${TABLE}
        WHERE created_at >= @startDate AND created_at <= @endDate
        GROUP BY date ORDER BY date ASC
      `,
      params: { startDate: startDate.toISOString(), endDate: endDate.toISOString() },
    };

    const statusQuery = {
      query: `
        SELECT
          COALESCE(financial_status, 'unknown') as status,
          COUNT(id) as count,
          SUM(total_price) as value
        FROM ${TABLE}
        WHERE created_at >= @startDate AND created_at <= @endDate
        GROUP BY status ORDER BY count DESC
      `,
      params: { startDate: startDate.toISOString(), endDate: endDate.toISOString() },
    };

    const [[currentRows], [prevRows], [trendRows], [statusRows]] = await Promise.all([
      bigquery.query(buildKpiQuery(startDate, endDate)),
      bigquery.query(buildKpiQuery(prevStart, prevEnd)),
      bigquery.query(trendQuery),
      bigquery.query(statusQuery),
    ]);

    const kpis = parseKpiRow(currentRows[0] ?? {}, diffDays);
    const previousKpis = parseKpiRow(prevRows[0] ?? {}, prevDiffDays);

    const deltas = {
      netSales: calcDelta(kpis.netSales, previousKpis.netSales),
      grossSales: calcDelta(kpis.grossSales, previousKpis.grossSales),
      netOrderCount: calcDelta(kpis.netOrderCount, previousKpis.netOrderCount),
      grossOrderCount: calcDelta(kpis.grossOrderCount, previousKpis.grossOrderCount),
      aov: calcDelta(kpis.aov, previousKpis.aov),
      averageDailySales: calcDelta(kpis.averageDailySales, previousKpis.averageDailySales),
      totalDiscounts: calcDelta(kpis.totalDiscounts, previousKpis.totalDiscounts),
    };

    const trend = trendRows.map(row => ({
      date: row.date,
      netSales: parseFloat(String(row.net_sales)) || 0,
      grossSales: parseFloat(String(row.gross_sales)) || 0,
      orders: parseInt(String(row.orders), 10) || 0,
    }));

    const paymentStatuses = statusRows.map(row => ({
      name: row.status,
      value: parseInt(String(row.count), 10) || 0,
      amount: parseFloat(String(row.value)) || 0,
    }));

    return NextResponse.json({
      success: true,
      data: {
        dateRange: { startDate, endDate, diffDays, prevStart, prevEnd },
        kpis,
        previousKpis,
        deltas,
        trend,
        paymentStatuses,
      },
    });
  } catch (error) {
    console.error('Error fetching Sales KPIs:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch sales data' }, { status: 500 });
  }
}
