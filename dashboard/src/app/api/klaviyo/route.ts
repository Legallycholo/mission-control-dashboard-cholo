import { NextResponse } from 'next/server';

const BASE = 'https://a.klaviyo.com/api';
const REV = '2024-10-15';

function missingConfig() {
  return NextResponse.json({
    success: false,
    reason: 'klaviyo_not_configured',
    message: 'KLAVIYO_PRIVATE_API_KEY no está configurado.',
  }, { status: 503 });
}

function klvHeaders() {
  return {
    Authorization: `Klaviyo-API-Key ${process.env.KLAVIYO_PRIVATE_API_KEY}`,
    revision: REV,
    Accept: 'application/json',
  };
}

async function klvGet(path: string, params?: Record<string, string>) {
  const qs = params ? '?' + new URLSearchParams(params) : '';
  const res = await fetch(`${BASE}${path}${qs}`, { headers: klvHeaders() });
  const json = await res.json();
  if (!res.ok) throw new Error(`Klaviyo ${path}: ${json.errors?.[0]?.detail ?? res.status}`);
  return json;
}

async function klvAggregate(metricId: string, measurements: string[], startDate: string, endDate: string) {
  const res = await fetch(`${BASE}/metric-aggregates/`, {
    method: 'POST',
    headers: { ...klvHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      data: {
        type: 'metric-aggregate',
        attributes: {
          metric_id: metricId,
          measurements,
          interval: 'day',
          filter: `greater-or-equal(datetime,${startDate}T00:00:00+00:00),less-or-equal(datetime,${endDate}T23:59:59+00:00)`,
          page_size: 500,
        },
      },
    }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`Klaviyo aggregate: ${json.errors?.[0]?.detail ?? res.status}`);
  return json;
}

// GET /api/klaviyo?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
export async function GET(request: Request) {
  const key = process.env.KLAVIYO_PRIVATE_API_KEY;
  if (!key || key === 'PLACEHOLDER_KLAVIYO_API_KEY') return missingConfig();

  const { searchParams } = new URL(request.url);
  const now = new Date();
  const startDate = searchParams.get('startDate') ?? new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  const endDate = searchParams.get('endDate') ?? now.toISOString().split('T')[0];

  try {
    // 1. Fetch metrics list + recent campaigns in parallel
    const [metricsRes, campaignsRes] = await Promise.all([
      klvGet('/metrics/', { 'page[size]': '200' }),
      klvGet('/campaigns/', {
        'filter': "equals(messages.channel,'email')",
        'fields[campaign]': 'name,status,send_time',
        'sort': '-send_time',
        'page[size]': '10',
      }).catch(() => ({ data: [] })),
    ]);

    const metrics: any[] = metricsRes.data ?? [];
    const findId = (name: string) => metrics.find(m => m.attributes.name === name)?.id;

    const receivedId = findId('Received Email');
    const openedId = findId('Opened Email');
    const clickedId = findId('Clicked Email');
    const orderId = findId('Placed Order');
    const unsubId = findId('Unsubscribed');

    // 2. Aggregate all metrics in parallel
    const [receivedAgg, openedAgg, clickedAgg, orderAgg, unsubAgg] = await Promise.allSettled([
      receivedId ? klvAggregate(receivedId, ['count'], startDate, endDate) : Promise.resolve(null),
      openedId ? klvAggregate(openedId, ['count'], startDate, endDate) : Promise.resolve(null),
      clickedId ? klvAggregate(clickedId, ['count'], startDate, endDate) : Promise.resolve(null),
      orderId ? klvAggregate(orderId, ['count', 'sum_value'], startDate, endDate) : Promise.resolve(null),
      unsubId ? klvAggregate(unsubId, ['count'], startDate, endDate) : Promise.resolve(null),
    ]);

    const extract = (result: PromiseSettledResult<any>) => {
      if (result.status === 'rejected' || !result.value) return { dates: [] as string[], count: [] as number[], sum_value: [] as number[] };
      const attrs = result.value.data?.attributes ?? {};
      const meas = attrs.data?.[0]?.measurements ?? {};
      return {
        dates: (attrs.dates ?? []) as string[],
        count: (meas.count ?? []) as number[],
        sum_value: (meas.sum_value ?? []) as number[],
      };
    };

    const received = extract(receivedAgg);
    const opened = extract(openedAgg);
    const clicked = extract(clickedAgg);
    const orders = extract(orderAgg);
    const unsubs = extract(unsubAgg);

    const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

    const totalSent = sum(received.count);
    const totalOpens = sum(opened.count);
    const totalClicks = sum(clicked.count);
    const totalRevenue = sum(orders.sum_value);
    const totalOrders = sum(orders.count);
    const totalUnsubs = sum(unsubs.count);

    const summary = {
      sent: totalSent,
      opens: totalOpens,
      clicks: totalClicks,
      revenue: totalRevenue,
      orders: totalOrders,
      unsubs: totalUnsubs,
      openRate: totalSent > 0 ? (totalOpens / totalSent) * 100 : 0,
      clickRate: totalSent > 0 ? (totalClicks / totalSent) * 100 : 0,
    };

    // 3. Build daily trend
    const dateMap: Record<string, { date: string; sent: number; opens: number; clicks: number; revenue: number }> = {};

    const addToMap = (dates: string[], values: number[], key: 'sent' | 'opens' | 'clicks' | 'revenue') => {
      dates.forEach((d, i) => {
        const day = d.split('T')[0];
        if (!dateMap[day]) dateMap[day] = { date: day, sent: 0, opens: 0, clicks: 0, revenue: 0 };
        dateMap[day][key] += values[i] ?? 0;
      });
    };

    addToMap(received.dates, received.count, 'sent');
    addToMap(opened.dates, opened.count, 'opens');
    addToMap(clicked.dates, clicked.count, 'clicks');
    addToMap(orders.dates, orders.sum_value, 'revenue');

    const trend = Object.values(dateMap).sort((a, b) => a.date.localeCompare(b.date));

    // 4. Shape campaigns
    const campaigns = (campaignsRes.data ?? []).map((c: any) => ({
      id: c.id,
      name: c.attributes.name,
      status: c.attributes.status,
      sendTime: c.attributes.send_time,
    }));

    return NextResponse.json({ success: true, data: { summary, trend, campaigns } });
  } catch (error: any) {
    console.error('Klaviyo API error:', error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
