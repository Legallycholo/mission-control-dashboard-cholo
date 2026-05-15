import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  const propertyId = process.env.GA4_PROPERTY_ID;
  if (!propertyId) {
    return NextResponse.json({
      success: false,
      reason: 'ga4_not_configured',
      message: 'GA4_PROPERTY_ID no está configurado. Agrega esta variable de entorno para activar este módulo.',
    }, { status: 503 });
  }

  try {
    const { BetaAnalyticsDataClient } = await import('@google-analytics/data');
    const credsB64 = process.env.GOOGLE_GA4_CREDENTIALS_BASE64;
    const client = credsB64 && credsB64 !== 'PLACEHOLDER_BASE64_SERVICE_ACCOUNT_JSON'
      ? new BetaAnalyticsDataClient({ credentials: JSON.parse(Buffer.from(credsB64, 'base64').toString()) })
      : new BetaAnalyticsDataClient();

    const [response] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: startDate ?? '30daysAgo', endDate: endDate ?? 'today' }],
      dimensions: [{ name: 'deviceCategory' }],
      metrics: [
        { name: 'sessions' },
        { name: 'bounceRate' },
        { name: 'conversions' },
        { name: 'totalRevenue' },
        { name: 'averageSessionDuration' },
      ],
    });

    const rows = (response.rows ?? []).map(row => ({
      device: row.dimensionValues?.[0]?.value ?? 'unknown',
      sessions: parseInt(row.metricValues?.[0]?.value ?? '0'),
      bounceRate: parseFloat(row.metricValues?.[1]?.value ?? '0'),
      conversions: parseInt(row.metricValues?.[2]?.value ?? '0'),
      revenue: parseFloat(row.metricValues?.[3]?.value ?? '0'),
      avgSessionDuration: parseFloat(row.metricValues?.[4]?.value ?? '0'),
    }));

    const totalSessions = rows.reduce((s, r) => s + r.sessions, 0);
    const enriched = rows.map(r => ({
      ...r,
      sessionShare: totalSessions > 0 ? (r.sessions / totalSessions) * 100 : 0,
    }));

    return NextResponse.json({ success: true, data: enriched, totalSessions });
  } catch (error: any) {
    console.error('GA4 dispositivos error:', error);
    const msg: string = error?.message ?? String(error);
    const isReauth = msg.includes('invalid_rapt') || msg.includes('invalid_grant') || msg.includes('reauth');
    if (isReauth) {
      return NextResponse.json({
        success: false,
        reason: 'reauth_required',
        error: 'Las credenciales de Google necesitan renovarse. Ejecuta: gcloud auth application-default login',
      }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: msg || 'Error desconocido al conectar con GA4' }, { status: 500 });
  }
}
