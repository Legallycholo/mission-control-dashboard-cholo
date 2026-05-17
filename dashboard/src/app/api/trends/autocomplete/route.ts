import { NextRequest, NextResponse } from 'next/server';

const SERPAPI = 'https://serpapi.com';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q  = (searchParams.get('q') || '').trim();
  const gl = searchParams.get('gl') || 'cl';
  const hl = searchParams.get('hl') || 'es';

  if (!q || q.length < 2) {
    return NextResponse.json({ success: true, data: { suggestions: [] } });
  }

  const apiKey = process.env.SERPAPI_KEY;
  if (!apiKey) {
    return NextResponse.json({ success: false, error: 'SERPAPI_KEY no configurada' }, { status: 500 });
  }

  try {
    const url = new URL(`${SERPAPI}/search.json`);
    url.searchParams.set('engine',  'google_autocomplete');
    url.searchParams.set('q',       q);
    url.searchParams.set('gl',      gl);
    url.searchParams.set('hl',      hl);
    url.searchParams.set('api_key', apiKey);

    const res  = await fetch(url.toString(), { next: { revalidate: 60 } });
    const json = await res.json();

    if (json.error) {
      return NextResponse.json({ success: false, error: json.error }, { status: 400 });
    }

    const suggestions = (json.suggestions ?? []).slice(0, 8).map((s: any) => ({
      value:    s.value     ?? '',
      type:     s.type      ?? 'query',
      boldText: s.bold_text ?? null,
    }));

    return NextResponse.json({ success: true, data: { suggestions } });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
