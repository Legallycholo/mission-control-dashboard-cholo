import { NextResponse } from 'next/server';
import { getGoogleAdsCustomer } from '@/lib/google-ads-client';

function gaqlDate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const start = gaqlDate((searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : firstDay));
    const end = gaqlDate((searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : now));

    const customer = getGoogleAdsCustomer();

    const rows = await customer.query(`
      SELECT
        search_term_view.search_term,
        search_term_view.status,
        metrics.impressions,
        metrics.clicks,
        metrics.cost_micros,
        metrics.conversions,
        metrics.ctr
      FROM search_term_view
      WHERE segments.date BETWEEN '${start}' AND '${end}'
        AND metrics.impressions > 0
      ORDER BY metrics.cost_micros DESC
      LIMIT 200
    `);

    const terms = rows.map(r => {
      const costMicros = Number(r.metrics?.cost_micros ?? 0);
      const impressions = Number(r.metrics?.impressions ?? 0);
      const clicks = Number(r.metrics?.clicks ?? 0);
      const conversions = Number(r.metrics?.conversions ?? 0);
      const cost = costMicros / 1_000_000;
      return {
        term: String(r.search_term_view?.search_term ?? ''),
        status: String(r.search_term_view?.status ?? ''),
        impressions,
        clicks,
        cost: Math.round(cost * 100) / 100,
        conversions,
        ctr: impressions > 0 ? clicks / impressions : 0,
        cpc: clicks > 0 ? cost / clicks : 0,
        isNegativeCandidate: cost > 5 && conversions === 0,
      };
    });

    return NextResponse.json({ success: true, data: { terms, dateRange: { start, end }, total: terms.length } });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    const isAuth = msg.includes('credentials missing') || msg.includes('UNAUTHENTICATED') || msg.includes('PERMISSION_DENIED');
    return NextResponse.json({ success: false, error: isAuth ? 'Google Ads authentication failed.' : msg }, { status: isAuth ? 401 : 500 });
  }
}
