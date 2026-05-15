import { NextResponse } from 'next/server';

const BASE = 'https://graph.facebook.com/v21.0';

function missingConfig() {
  return NextResponse.json({
    success: false,
    reason: 'meta_not_configured',
    message: 'META_ACCESS_TOKEN o META_AD_ACCOUNT_ID no están configurados.',
  }, { status: 503 });
}

async function fbGet(path: string, params: Record<string, string>) {
  const token = process.env.META_ACCESS_TOKEN!;
  const qs = new URLSearchParams({ ...params, access_token: token });
  const res = await fetch(`${BASE}${path}?${qs}`);
  const json = await res.json();
  if (json.error) throw new Error(`Meta API: ${json.error.message} (code ${json.error.code})`);
  return json;
}

// GET /api/meta?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
export async function GET(request: Request) {
  const token = process.env.META_ACCESS_TOKEN;
  const rawAccountId = process.env.META_AD_ACCOUNT_ID;
  if (!token || !rawAccountId) return missingConfig();

  const accountId = rawAccountId.startsWith('act_') ? rawAccountId : `act_${rawAccountId}`;
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get('startDate') ?? new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
  const endDate = searchParams.get('endDate') ?? new Date().toISOString().split('T')[0];

  try {
    const fields = 'spend,impressions,clicks,ctr,cpc,cpm,reach,actions,action_values,roas';
    const timeRange = JSON.stringify({ since: startDate, until: endDate });

    // Overview + campaigns in parallel
    const [overview, campaignsRaw] = await Promise.all([
      fbGet(`/${accountId}/insights`, {
        fields,
        time_range: timeRange,
        level: 'account',
      }),
      fbGet(`/${accountId}/insights`, {
        fields: `campaign_name,campaign_id,${fields}`,
        time_range: timeRange,
        level: 'campaign',
        limit: '20',
      }),
    ]);

    const ovData = overview.data?.[0] ?? {};

    const findAction = (actions: any[], type: string) =>
      parseFloat(actions?.find((a: any) => a.action_type === type)?.value ?? '0');

    const purchases = findAction(ovData.actions, 'purchase');
    const purchaseValue = findAction(ovData.action_values, 'purchase');
    const spend = parseFloat(ovData.spend ?? '0');
    const roas = spend > 0 ? purchaseValue / spend : 0;

    const summary = {
      spend,
      impressions: parseInt(ovData.impressions ?? '0'),
      clicks: parseInt(ovData.clicks ?? '0'),
      ctr: parseFloat(ovData.ctr ?? '0'),
      cpc: parseFloat(ovData.cpc ?? '0'),
      cpm: parseFloat(ovData.cpm ?? '0'),
      reach: parseInt(ovData.reach ?? '0'),
      purchases,
      purchaseValue,
      roas,
    };

    const campaigns = (campaignsRaw.data ?? []).map((c: any) => {
      const cPurchases = findAction(c.actions, 'purchase');
      const cValue = findAction(c.action_values, 'purchase');
      const cSpend = parseFloat(c.spend ?? '0');
      return {
        id: c.campaign_id,
        name: c.campaign_name,
        spend: cSpend,
        impressions: parseInt(c.impressions ?? '0'),
        clicks: parseInt(c.clicks ?? '0'),
        ctr: parseFloat(c.ctr ?? '0'),
        cpc: parseFloat(c.cpc ?? '0'),
        cpm: parseFloat(c.cpm ?? '0'),
        reach: parseInt(c.reach ?? '0'),
        purchases: cPurchases,
        purchaseValue: cValue,
        roas: cSpend > 0 ? cValue / cSpend : 0,
      };
    });

    // Daily breakdown for chart
    const daily = await fbGet(`/${accountId}/insights`, {
      fields: 'spend,impressions,clicks,actions,action_values',
      time_range: timeRange,
      time_increment: '1',
      level: 'account',
      limit: '90',
    });

    const trend = (daily.data ?? []).map((d: any) => ({
      date: d.date_start,
      spend: parseFloat(d.spend ?? '0'),
      clicks: parseInt(d.clicks ?? '0'),
      impressions: parseInt(d.impressions ?? '0'),
      purchases: findAction(d.actions, 'purchase'),
    }));

    return NextResponse.json({ success: true, data: { summary, campaigns, trend } });
  } catch (error: any) {
    console.error('Meta API error:', error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
