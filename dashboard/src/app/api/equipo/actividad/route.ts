import { NextResponse } from 'next/server';
import { BigQuery } from '@google-cloud/bigquery';

const PROJECT = process.env.GCP_PROJECT_ID;
const DS = 'raw_layer';

export async function GET(request: Request) {
  try {
    const bq = new BigQuery({ projectId: PROJECT });
    const { searchParams } = new URL(request.url);

    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const startDate = searchParams.get('startDate') || firstDay.toISOString();
    const endDate = searchParams.get('endDate') || now.toISOString();
    const advisor = searchParams.get('advisor') || '';
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
    const limit = Math.min(100, Math.max(10, parseInt(searchParams.get('limit') ?? '50', 10)));
    const offset = (page - 1) * limit;

    const advisorFilter = advisor
      ? `AND CONCAT(IFNULL(s.first_name, ''), ' ', IFNULL(s.last_name, '')) = @advisor`
      : '';

    const querySummary = `
      SELECT
        a.staff_id,
        CONCAT(IFNULL(s.first_name, ''), ' ', IFNULL(s.last_name, '')) as full_name,
        a.action,
        COUNT(*) as event_count,
        MAX(a.occurred_at) as last_activity
      FROM \`${PROJECT}.${DS}.shopify_audit_log\` a
      JOIN \`${PROJECT}.${DS}.shopify_staff\` s ON a.staff_id = s.staff_id
      WHERE a.staff_id IS NOT NULL
        AND a.occurred_at >= @startDate AND a.occurred_at <= @endDate
      GROUP BY a.staff_id, full_name, a.action
      ORDER BY event_count DESC
    `;

    const queryCount = `
      SELECT COUNT(*) as total
      FROM \`${PROJECT}.${DS}.shopify_audit_log\` a
      JOIN \`${PROJECT}.${DS}.shopify_staff\` s ON a.staff_id = s.staff_id
      WHERE a.staff_id IS NOT NULL
        AND a.occurred_at >= @startDate AND a.occurred_at <= @endDate
        ${advisorFilter}
    `;

    const queryEvents = `
      SELECT
        a.audit_id,
        a.occurred_at,
        CONCAT(IFNULL(s.first_name, ''), ' ', IFNULL(s.last_name, '')) as full_name,
        a.action,
        a.subject_type,
        a.subject_id
      FROM \`${PROJECT}.${DS}.shopify_audit_log\` a
      JOIN \`${PROJECT}.${DS}.shopify_staff\` s ON a.staff_id = s.staff_id
      WHERE a.staff_id IS NOT NULL
        AND a.occurred_at >= @startDate AND a.occurred_at <= @endDate
        ${advisorFilter}
      ORDER BY a.occurred_at DESC
      LIMIT @limit OFFSET @offset
    `;

    const baseParams = { startDate, endDate };
    const filteredParams = advisor ? { ...baseParams, advisor } : baseParams;

    const [[summaryRows], [countRows], [eventRows]] = await Promise.all([
      bq.query({ query: querySummary, params: baseParams }),
      bq.query({ query: queryCount, params: filteredParams }),
      bq.query({ query: queryEvents, params: { ...filteredParams, limit, offset } }),
    ]);

    const total = parseInt(String(countRows[0]?.total), 10) || 0;

    return NextResponse.json({
      summary: summaryRows,
      recentEvents: eventRows,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      filters: { startDate, endDate, advisor },
    });
  } catch (err: unknown) {
    console.error('Error fetching team activity:', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Unknown error' }, { status: 500 });
  }
}
