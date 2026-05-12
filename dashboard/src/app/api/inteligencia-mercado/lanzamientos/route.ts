import { NextResponse } from 'next/server';
import { BigQuery } from '@google-cloud/bigquery';

const bq = new BigQuery({ projectId: process.env.GCP_PROJECT_ID });

export async function GET() {
  try {
    const query = `
      SELECT id, producto, marca, categoria, especificaciones_clave, fuente, estado_db, fecha_escaneo
      FROM \`${process.env.GCP_PROJECT_ID}.raw_layer.market_intelligence_launches\`
      ORDER BY fecha_escaneo DESC
      LIMIT 200
    `;
    const [rows] = await bq.query(query);
    return NextResponse.json({ status: 'success', data: rows });
  } catch (error: any) {
    console.error("Error fetching market intelligence data:", error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function POST() {
  return NextResponse.json(
    {
      status: 'disabled',
      message: 'Market intelligence scan is temporarily disabled in Next.js-only mode.'
    },
    { status: 501 }
  );
}
