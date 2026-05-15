import { NextResponse } from 'next/server';
import { bq, DATASET_ID } from '@/lib/bigquery';

const PROJECT_ID = process.env.GCP_PROJECT_ID;
const TABLE = `\`${PROJECT_ID}.${DATASET_ID}.pnl_costs\``;

// GET /api/finanzas/pnl?period=2026-05
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get('period') ?? new Date().toISOString().slice(0, 7);

  try {
    // Revenue from Shopify orders
    const revenueQuery = `
      SELECT
        COALESCE(SUM(CASE WHEN financial_status = 'paid' THEN total_price_usd ELSE 0 END), 0)        AS net_sales,
        COALESCE(SUM(total_price_usd), 0)                                                              AS gross_sales,
        COALESCE(SUM(CASE WHEN financial_status = 'paid' THEN total_discounts_usd ELSE 0 END), 0)     AS discounts,
        COALESCE(SUM(CASE WHEN financial_status = 'paid' THEN shipping_price_usd ELSE 0 END), 0)      AS shipping_revenue,
        COUNT(CASE WHEN financial_status = 'paid' THEN 1 END)                                          AS order_count
      FROM \`${PROJECT_ID}.${DATASET_ID}.shopify_orders\`
      WHERE FORMAT_DATE('%Y-%m', DATE(created_at)) = @period
    `;

    // Manual cost entries
    const costsQuery = `
      SELECT id, category, name, amount_usd, notes, created_at, updated_at
      FROM ${TABLE}
      WHERE period = @period
      ORDER BY category, name
    `;

    const [revenueRows, costRows] = await Promise.all([
      bq.query({ query: revenueQuery, params: { period } }),
      bq.query({ query: costsQuery, params: { period } }).catch(() => [[]] as any),
    ]);

    const rev = revenueRows[0][0] ?? {};
    const netSales = Number(rev.net_sales ?? 0);
    const grossSales = Number(rev.gross_sales ?? 0);
    const discounts = Number(rev.discounts ?? 0);

    const costs: any[] = (costRows[0] ?? []).map((r: any) => ({
      ...r,
      amount_usd: Number(r.amount_usd),
      created_at: r.created_at?.value ?? null,
      updated_at: r.updated_at?.value ?? null,
    }));

    const sumByCategory = (cat: string) =>
      costs.filter(c => c.category === cat).reduce((s, c) => s + c.amount_usd, 0);

    const cogs = sumByCategory('COGS');
    const opex = sumByCategory('OPEX');
    const gateway = sumByCategory('GATEWAY');
    const shipping = sumByCategory('SHIPPING');
    const marketing = sumByCategory('MARKETING');
    const other = sumByCategory('OTHER');

    const grossProfit = netSales - cogs;
    const grossMargin = netSales > 0 ? (grossProfit / netSales) * 100 : 0;
    const totalOpex = opex + gateway + shipping + marketing + other;
    const operatingProfit = grossProfit - totalOpex;
    const operatingMargin = netSales > 0 ? (operatingProfit / netSales) * 100 : 0;

    return NextResponse.json({
      success: true,
      data: {
        period,
        revenue: { netSales, grossSales, discounts, orderCount: Number(rev.order_count ?? 0) },
        costs,
        summary: {
          grossProfit,
          grossMargin,
          cogs,
          opex,
          gateway,
          shipping,
          marketing,
          other,
          totalOpex,
          operatingProfit,
          operatingMargin,
        },
      },
    });
  } catch (error: any) {
    console.error('P&L API error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/finanzas/pnl — upsert a cost entry
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, period, category, name, amount_usd, notes } = body;

    if (!period || !category || !name || amount_usd == null) {
      return NextResponse.json({ success: false, error: 'Faltan campos requeridos: period, category, name, amount_usd' }, { status: 400 });
    }

    const allowedCategories = ['COGS', 'OPEX', 'GATEWAY', 'SHIPPING', 'MARKETING', 'OTHER'];
    if (!allowedCategories.includes(category)) {
      return NextResponse.json({ success: false, error: `Categoría inválida. Usa: ${allowedCategories.join(', ')}` }, { status: 400 });
    }

    const now = new Date().toISOString();
    const rowId = id ?? crypto.randomUUID();

    const mergeQuery = `
      MERGE ${TABLE} AS target
      USING (
        SELECT
          @id         AS id,
          @period     AS period,
          @category   AS category,
          @name       AS name,
          CAST(@amount_usd AS FLOAT64) AS amount_usd,
          @notes      AS notes,
          TIMESTAMP(@now) AS created_at,
          TIMESTAMP(@now) AS updated_at
      ) AS source
      ON target.id = source.id
      WHEN MATCHED THEN UPDATE SET
        name       = source.name,
        amount_usd = source.amount_usd,
        notes      = source.notes,
        updated_at = source.updated_at
      WHEN NOT MATCHED THEN INSERT (id, period, category, name, amount_usd, notes, created_at, updated_at)
        VALUES (source.id, source.period, source.category, source.name, source.amount_usd, source.notes, source.created_at, source.updated_at)
    `;

    await bq.query({
      query: mergeQuery,
      params: { id: rowId, period, category, name, amount_usd: Number(amount_usd), notes: notes ?? '', now },
    });

    return NextResponse.json({ success: true, id: rowId });
  } catch (error: any) {
    console.error('P&L POST error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE /api/finanzas/pnl?id=xxx
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ success: false, error: 'id requerido' }, { status: 400 });

  try {
    await bq.query({ query: `DELETE FROM ${TABLE} WHERE id = @id`, params: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
