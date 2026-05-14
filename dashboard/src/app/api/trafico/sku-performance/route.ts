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
    const start = gaqlDate(searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : firstDay);
    const end = gaqlDate(searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : now);

    const customer = getGoogleAdsCustomer();

    const rows = await customer.query(`
      SELECT
        segments.product_item_id,
        segments.product_title,
        segments.product_brand,
        metrics.impressions,
        metrics.clicks,
        metrics.cost_micros,
        metrics.conversions,
        metrics.conversions_value
      FROM shopping_performance_view
      WHERE segments.date BETWEEN '${start}' AND '${end}'
        AND metrics.impressions > 0
      ORDER BY metrics.cost_micros DESC
      LIMIT 100
    `);

    const skus = rows.map(r => {
      const cost = Number(r.metrics?.cost_micros ?? 0) / 1_000_000;
      const conversionsValue = Number(r.metrics?.conversions_value ?? 0);
      const conversions = Number(r.metrics?.conversions ?? 0);
      const clicks = Number(r.metrics?.clicks ?? 0);
      const impressions = Number(r.metrics?.impressions ?? 0);
      const roas = cost > 0 ? conversionsValue / cost : 0;
      return {
        itemId: String(r.segments?.product_item_id ?? ''),
        title: String(r.segments?.product_title ?? 'Sin nombre'),
        brand: String(r.segments?.product_brand ?? ''),
        impressions,
        clicks,
        cost: Math.round(cost * 100) / 100,
        conversions,
        conversionsValue: Math.round(conversionsValue * 100) / 100,
        roas: Math.round(roas * 100) / 100,
        ctr: impressions > 0 ? clicks / impressions : 0,
        roasLabel: roas >= 3 ? 'high' : roas >= 1 ? 'medium' : 'low',
      };
    });

    return NextResponse.json({ success: true, data: { skus, dateRange: { start, end }, total: skus.length } });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    const isAuth = msg.includes('credentials missing') || msg.includes('UNAUTHENTICATED') || msg.includes('PERMISSION_DENIED');
    return NextResponse.json({ success: false, error: isAuth ? 'Google Ads authentication failed.' : msg }, { status: isAuth ? 401 : 500 });
  }
}
