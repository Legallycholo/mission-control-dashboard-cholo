import { NextResponse } from 'next/server';
import { BigQuery } from '@google-cloud/bigquery';
import { GoogleAuth } from 'google-auth-library';

const bigquery = new BigQuery({ projectId: process.env.GCP_PROJECT_ID });
const PROJECT_ID = process.env.GCP_PROJECT_ID!;
const FIRESTORE_BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

async function getFirestoreToken() {
  const auth = new GoogleAuth({ scopes: ['https://www.googleapis.com/auth/datastore'] });
  const client = await auth.getClient();
  const tokenResponse = await client.getAccessToken();
  return tokenResponse.token;
}

function parseDoubleOrInt(field: unknown): number {
  if (!field || typeof field !== 'object') return 0;
  const f = field as Record<string, unknown>;
  if ('doubleValue' in f) return parseFloat(String(f.doubleValue)) || 0;
  if ('integerValue' in f) return parseInt(String(f.integerValue), 10) || 0;
  return 0;
}

export async function GET() {
  try {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const daysElapsed = Math.max(1, Math.ceil((now.getTime() - firstDayOfMonth.getTime()) / (1000 * 60 * 60 * 24)));
    const remainingDays = daysInMonth - daysElapsed;

    const [token, [rows]] = await Promise.all([
      getFirestoreToken(),
      bigquery.query({
        query: `
          SELECT SUM(CASE WHEN financial_status IN ('paid', 'partially_refunded') THEN total_price ELSE 0 END) as net_sales
          FROM \`${PROJECT_ID}.ecommerce_data.shopify_orders\`
          WHERE created_at >= @startDate AND created_at <= @endDate
        `,
        params: { startDate: firstDayOfMonth.toISOString(), endDate: now.toISOString() },
      }),
    ]);

    const netSales = parseFloat(String(rows[0]?.net_sales)) || 0;

    let goal = 0;
    try {
      const goalRes = await fetch(`${FIRESTORE_BASE}/goals/ventas_mensual`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (goalRes.ok) {
        const doc = await goalRes.json();
        goal = parseDoubleOrInt(doc.fields?.amount);
      }
    } catch {
      // Firestore not reachable — return with goal = 0
    }

    const progress = goal > 0 ? Math.min(100, (netSales / goal) * 100) : 0;
    const runRate = daysElapsed > 0 ? (netSales / daysElapsed) * daysInMonth : 0;
    const remaining = Math.max(0, goal - netSales);
    const dailyNeeded = remainingDays > 0 ? remaining / remainingDays : 0;

    return NextResponse.json({
      success: true,
      data: { goal, netSales, progress, runRate, daysElapsed, daysInMonth, remainingDays, dailyNeeded },
    });
  } catch (error) {
    console.error('Error fetching goals:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch goals' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const amount = Number(body.amount);
    if (!amount || amount <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid amount' }, { status: 400 });
    }

    const token = await getFirestoreToken();
    const res = await fetch(`${FIRESTORE_BASE}/goals/ventas_mensual`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fields: {
          amount: { doubleValue: amount },
          currency: { stringValue: 'USD' },
          updatedAt: { timestampValue: new Date().toISOString() },
        },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Firestore PATCH failed:', err);
      return NextResponse.json({ success: false, error: 'Failed to save goal' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving goal:', error);
    return NextResponse.json({ success: false, error: 'Failed to save goal' }, { status: 500 });
  }
}
