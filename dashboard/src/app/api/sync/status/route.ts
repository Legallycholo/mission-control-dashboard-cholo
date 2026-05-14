import { NextResponse } from 'next/server';
import { GoogleAuth } from 'google-auth-library';

const PROJECT_ID = process.env.GCP_PROJECT_ID!;
const FIRESTORE_BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

const DATA_SOURCES = ['shopify', 'gsc', 'google_ads', 'crisp', 'ringcentral'] as const;

async function getFirestoreToken() {
  const auth = new GoogleAuth({ scopes: ['https://www.googleapis.com/auth/datastore'] });
  const client = await auth.getClient();
  const tokenResponse = await client.getAccessToken();
  return tokenResponse.token;
}

function parseFirestoreTimestamp(value: unknown): string | null {
  if (value && typeof value === 'object' && 'timestampValue' in value) {
    return (value as { timestampValue: string }).timestampValue;
  }
  return null;
}

function parseFirestoreString(value: unknown): string | null {
  if (value && typeof value === 'object' && 'stringValue' in value) {
    return (value as { stringValue: string }).stringValue;
  }
  return null;
}

function parseFirestoreInt(value: unknown): number {
  if (value && typeof value === 'object' && 'integerValue' in value) {
    return parseInt((value as { integerValue: string }).integerValue, 10) || 0;
  }
  return 0;
}

export async function GET() {
  try {
    const token = await getFirestoreToken();

    const results = await Promise.allSettled(
      DATA_SOURCES.map(async (source) => {
        const res = await fetch(`${FIRESTORE_BASE}/sync_status/${source}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return { source, status: 'no_data', lastSync: null, recordsProcessed: 0 };
        const doc = await res.json();
        const fields = doc.fields ?? {};
        return {
          source,
          status: parseFirestoreString(fields.status) ?? 'unknown',
          lastSync: parseFirestoreTimestamp(fields.lastSync),
          recordsProcessed: parseFirestoreInt(fields.recordsProcessed),
        };
      })
    );

    const sources = results.map((r, i) =>
      r.status === 'fulfilled'
        ? r.value
        : { source: DATA_SOURCES[i], status: 'no_data', lastSync: null, recordsProcessed: 0 }
    );

    // Overall status: error if any source errored, ok if all ok, no_data if none synced yet
    const hasError = sources.some((s) => s.status === 'error');
    const hasData = sources.some((s) => s.lastSync !== null);
    const overallStatus = hasError ? 'error' : hasData ? 'ok' : 'no_data';

    const mostRecentSync = sources
      .map((s) => s.lastSync)
      .filter(Boolean)
      .sort()
      .at(-1) ?? null;

    return NextResponse.json({
      success: true,
      data: { overallStatus, mostRecentSync, sources },
    });
  } catch (error) {
    console.error('Error fetching sync status:', error);
    return NextResponse.json({
      success: true,
      data: { overallStatus: 'no_data', mostRecentSync: null, sources: [] },
    });
  }
}
