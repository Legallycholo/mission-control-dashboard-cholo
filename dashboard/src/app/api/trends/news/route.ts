import { NextRequest, NextResponse } from 'next/server';

const SERPAPI = 'https://serpapi.com';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q  = (searchParams.get('q') || '').trim();
  const gl = searchParams.get('gl') || 'cl';
  const hl = searchParams.get('hl') || 'es';

  if (!q) {
    return NextResponse.json({ success: false, error: 'Query requerida' }, { status: 400 });
  }

  const apiKey = process.env.SERPAPI_KEY;
  if (!apiKey) {
    return NextResponse.json({ success: false, error: 'SERPAPI_KEY no configurada' }, { status: 500 });
  }

  try {
    const url = new URL(`${SERPAPI}/search.json`);
    url.searchParams.set('engine',  'google_news');
    url.searchParams.set('q',       q);
    url.searchParams.set('gl',      gl);
    url.searchParams.set('hl',      hl);
    url.searchParams.set('api_key', apiKey);

    const res  = await fetch(url.toString(), { next: { revalidate: 900 } });
    const json = await res.json();

    if (json.error) {
      return NextResponse.json({ success: false, error: json.error }, { status: 400 });
    }

    const articles = (json.news_results ?? []).slice(0, 10).map((a: any) => ({
      title:     a.title              ?? '—',
      link:      a.link               ?? null,
      source:    a.source?.name ?? (typeof a.source === 'string' ? a.source : '—'),
      date:      a.date               ?? null,
      snippet:   a.snippet            ?? null,
      thumbnail: a.thumbnail          ?? null,
    }));

    return NextResponse.json({
      success: true,
      data: { query: q, articles, fetchedAt: new Date().toISOString() },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
