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
    const segment = searchParams.get('segment') || 'all'; // 'branded' | 'non_branded' | 'all'

    const query = `
      SELECT
        query,
        SUM(clicks) as clicks,
        SUM(impressions) as impressions,
        AVG(ctr) as ctr,
        AVG(position) as position,
        CASE
          WHEN LOWER(query) LIKE '%gsmpro%' OR LOWER(query) LIKE '%gsm pro%'
               OR LOWER(query) LIKE '%gsm-pro%'
            THEN 'branded'
          ELSE 'non_branded'
        END as segment
      FROM \`${PROJECT}.ecommerce_data.gsc_metrics\`
      WHERE date BETWEEN @startDate AND @endDate
      GROUP BY query, segment
      ORDER BY clicks DESC
    `;

    const [rows] = await bigquery.query({ query, params: { startDate, endDate } });

    const allQueries = rows.map(r => ({
      query: r.query,
      clicks: parseInt(String(r.clicks), 10) || 0,
      impressions: parseInt(String(r.impressions), 10) || 0,
      ctr: parseFloat(String(r.ctr)) || 0,
      position: parseFloat(String(r.position)) || 0,
      segment: r.segment as 'branded' | 'non_branded',
    }));

    // Aggregate KPIs per segment
    const buildKpis = (list: typeof allQueries) => {
      const totalClicks = list.reduce((s, r) => s + r.clicks, 0);
      const totalImpressions = list.reduce((s, r) => s + r.impressions, 0);
      const avgCtr = list.length > 0 ? list.reduce((s, r) => s + r.ctr, 0) / list.length : 0;
      const avgPos = list.length > 0 ? list.reduce((s, r) => s + r.position, 0) / list.length : 0;
      return { clicks: totalClicks, impressions: totalImpressions, avgCtr, avgPosition: avgPos, queryCount: list.length };
    };

    const branded = allQueries.filter(r => r.segment === 'branded');
    const nonBranded = allQueries.filter(r => r.segment === 'non_branded');

    const filtered = segment === 'branded' ? branded : segment === 'non_branded' ? nonBranded : allQueries;

    return NextResponse.json({
      success: true,
      data: {
        queries: filtered.slice(0, 100),
        kpis: {
          branded: buildKpis(branded),
          non_branded: buildKpis(nonBranded),
          all: buildKpis(allQueries),
        },
        dateRange: { startDate, endDate },
      },
    });
  } catch (error: unknown) {
    console.error('Error fetching seo-segmentado:', error);
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
