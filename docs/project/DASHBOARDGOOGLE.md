# DASHBOARDGOOGLE — Mission Control Implementation Plan

> **For Claude Code:** Execute each wave sequentially. All paths are relative to `dashboard/`.
> Stack: Next.js App Router · BigQuery · Firebase (Auth + Firestore) · Google Ads API · GSC via BigQuery · Recharts · Tailwind CSS.

---

## 0 — ENV PLACEHOLDERS

Add these to `.env.local` immediately. Fill real values when credentials are obtained.

```bash
# ── Already configured ──────────────────────────────────────────────
# NEXT_PUBLIC_FIREBASE_API_KEY=...
# NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
# NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
# NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
# NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
# NEXT_PUBLIC_FIREBASE_APP_ID=...
# GCP_PROJECT_ID=...
# GOOGLE_ADS_DEVELOPER_TOKEN=...
# GOOGLE_ADS_CLIENT_ID=...
# GOOGLE_ADS_CLIENT_SECRET=...
# GOOGLE_ADS_REFRESH_TOKEN=...
# GOOGLE_ADS_CUSTOMER_ID=...
# GOOGLE_ADS_LOGIN_CUSTOMER_ID=...

# ── GA4 (Google Analytics 4) ─────────────────────────────────────────
# Get from: Google Analytics → Admin → Property → Property details
GA4_PROPERTY_ID=PLACEHOLDER_GA4_PROPERTY_ID
# Service account JSON (base64-encoded) with roles/viewer on the GA4 property
GOOGLE_GA4_CREDENTIALS_BASE64=PLACEHOLDER_BASE64_SERVICE_ACCOUNT_JSON

# ── Google Merchant Center ───────────────────────────────────────────
# Get from: Google Merchant Center → Settings → Account information
MERCHANT_CENTER_ID=PLACEHOLDER_MERCHANT_CENTER_ID
# Reuse same GCP service account — grant it Merchant Center API access in GCP Console
# Enable: Content API for Shopping at console.cloud.google.com/apis

# ── Vertex AI ────────────────────────────────────────────────────────
# Same GCP project as BigQuery — enable Vertex AI API in GCP Console
VERTEX_AI_LOCATION=us-central1
# No extra key needed if using ADC (Application Default Credentials) via service account

# ── Google My Business (Business Profile API) ────────────────────────
# Get from: Google Cloud Console → Business Profile API
# GMB_ACCOUNT_ID format: accounts/XXXXXXXXXX
GMB_ACCOUNT_ID=PLACEHOLDER_GMB_ACCOUNT_ID
# GMB_LOCATION_ID format: accounts/XXXXXXXXXX/locations/XXXXXXXXXX
GMB_LOCATION_ID=PLACEHOLDER_GMB_LOCATION_ID

# ── Google Sheets (for goal export & sales targets) ──────────────────
# Create a Google Sheet → share with service account email → paste ID here
GOOGLE_SHEETS_GOALS_ID=PLACEHOLDER_GOOGLE_SHEETS_ID

# ── Klaviyo (Email/Push — already in codebase) ───────────────────────
# Check src/app/api/kpis/klaviyo/route.ts for exact var name needed
KLAVIYO_API_KEY=PLACEHOLDER_KLAVIYO_API_KEY
```

---

## WAVE 1 — Zero new API keys (BigQuery + Firestore + existing data)

> These build entirely on what is already connected. Start here.

---

### W1-A · MoM/YoY Period Comparison Badges on every KPI card

**Value:** Every existing KPI card gains a % change arrow vs prior period. High visibility, zero new data sources.

**Files to create/edit:**
- `src/lib/period-compare.ts` — shared helper
- `src/app/api/ventas/kpis/route.ts` — add `previousPeriod` block to response
- `src/app/api/trafico/general/route.ts` — same
- `src/app/api/google-ads/kpis/route.ts` — same
- `src/components/ui/DeltaBadge.tsx` — reusable badge component

**Implementation:**

```typescript
// src/lib/period-compare.ts
export function getPreviousPeriod(start: Date, end: Date): { prevStart: Date; prevEnd: Date } {
  const diffMs = end.getTime() - start.getTime();
  const prevEnd = new Date(start.getTime() - 1);
  const prevStart = new Date(prevEnd.getTime() - diffMs);
  return { prevStart, prevEnd };
}

export function calcDelta(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}
```

```typescript
// src/components/ui/DeltaBadge.tsx
// Props: value (number, %) + inverse (bool — for bounce rate where lower is better)
// Render: green arrow up / red arrow down + formatted %
// Use TrendingUp / TrendingDown from lucide-react
```

**BigQuery pattern to add inside each API route:**
```sql
-- Run same query for previous period using getPreviousPeriod() dates
-- Merge both results into: { current: {...kpis}, previous: {...kpis}, deltas: {...} }
```

---

### W1-B · Sales Goal Progress Bar (Pacing) + Run-Rate Forecast

**Value:** Shows how close the team is to hitting the monthly target. Forecast shows where they will land at current pace.

**Files to create/edit:**
- `src/app/api/ventas/goals/route.ts` — GET/POST to read+write goal from Firestore `goals/ventas_mensual`
- `src/app/ventas/kpis/page.tsx` — add PacingBar component below KPI cards

**Firestore structure:**
```
Collection: goals
Document:   ventas_mensual
Fields:     { amount: number, currency: 'CLP', updatedAt: timestamp, updatedBy: string }
```

**API route logic (GET):**
```typescript
// 1. Read goal from Firestore goals/ventas_mensual
// 2. Read current net_sales from BigQuery (MTD)
// 3. Calculate: progress % = (netSales / goal) * 100
// 4. Calculate: daysElapsed, daysInMonth, remainingDays
// 5. runRate = (netSales / daysElapsed) * daysInMonth  ← projected close
// 6. Return: { goal, netSales, progress, runRate, daysElapsed, remainingDays }
```

**API route logic (POST):**
```typescript
// Receive { amount: number } — write to Firestore goals/ventas_mensual
// Auth check: require role === 'admin' from useRole
```

**UI Component spec:**
```
┌─────────────────────────────────────────────────────┐
│  Meta Mensual                          [✏ Editar]   │
│  $12.400.000 / $20.000.000 (62%)                    │
│  ████████████░░░░░░░░  62%                          │
│  📈 Proyección de cierre: $19.800.000               │
│  Faltan 8 días · Promedio diario necesario: $950.000│
└─────────────────────────────────────────────────────┘
```

---

### W1-C · Sales by Category Breakdown (Desglose por Categoría)

**Value:** Reveals which product categories drive revenue. Already in Shopify → BigQuery pipeline.

**Files to create:**
- `src/app/api/ventas/categorias/route.ts`
- `src/app/ventas/categorias/page.tsx`

**Add to Sidebar navigation** under Ventas section.

**BigQuery query:**
```sql
SELECT
  COALESCE(product_type, 'Sin categoría') as category,
  COUNT(DISTINCT order_id) as orders,
  SUM(quantity) as units_sold,
  SUM(price * quantity) as revenue,
  SUM(total_discounts) as discounts
FROM `{GCP_PROJECT_ID}.ecommerce_data.shopify_order_line_items` li
JOIN `{GCP_PROJECT_ID}.ecommerce_data.shopify_orders` o ON li.order_id = o.id
WHERE o.created_at BETWEEN @startDate AND @endDate
  AND o.financial_status IN ('paid', 'partially_refunded')
GROUP BY category
ORDER BY revenue DESC
LIMIT 20
```

**UI spec:** Horizontal bar chart (Recharts BarChart horizontal) + summary table with revenue, units, % of total. Date range selector reused from existing pattern.

---

### W1-D · New vs Returning Customers (Ventas Nuevos vs Recurrentes)

**Value:** Measures retention. A returning customer costs 5x less to acquire.

**Files to create:**
- `src/app/api/ventas/retencion/route.ts`
- Add section to `src/app/ventas/kpis/page.tsx` OR new page `src/app/ventas/retencion/page.tsx`

**BigQuery query:**
```sql
WITH customer_orders AS (
  SELECT
    email,
    id as order_id,
    created_at,
    total_price,
    financial_status,
    ROW_NUMBER() OVER (PARTITION BY email ORDER BY created_at ASC) as order_rank
  FROM `{GCP_PROJECT_ID}.ecommerce_data.shopify_orders`
  WHERE financial_status IN ('paid', 'partially_refunded')
),
period_orders AS (
  SELECT
    co.*,
    CASE WHEN order_rank = 1 THEN 'new' ELSE 'returning' END as customer_type
  FROM customer_orders co
  WHERE co.created_at BETWEEN @startDate AND @endDate
)
SELECT
  customer_type,
  COUNT(DISTINCT email) as customers,
  COUNT(order_id) as orders,
  SUM(total_price) as revenue
FROM period_orders
GROUP BY customer_type
```

**UI spec:** Donut chart (same pattern as payment status donut in ventas/kpis) + 2 KPI cards (New Revenue vs Returning Revenue).

---

### W1-E · Sales by Payment Method (Ventas por Método de Pago)

**Value:** Understand which gateways dominate → negotiate lower commissions.

**Files to create:**
- `src/app/api/ventas/metodo-pago/route.ts`
- Add as new tab/section in `src/app/ventas/kpis/page.tsx`

**BigQuery query:**
```sql
SELECT
  COALESCE(payment_gateway, 'unknown') as gateway,
  COUNT(id) as orders,
  SUM(total_price) as revenue,
  AVG(total_price) as avg_order_value
FROM `{GCP_PROJECT_ID}.ecommerce_data.shopify_orders`
WHERE created_at BETWEEN @startDate AND @endDate
  AND financial_status IN ('paid', 'partially_refunded')
GROUP BY gateway
ORDER BY revenue DESC
```

**UI spec:** Pie/donut chart + table with gateway name, orders, revenue, % of total, avg ticket.

---

### W1-F · Top Categories KPI Ranking

**Value:** Quick-reference ranking of best sellers in the period.

**Files to edit:**
- Reuse data from `src/app/api/ventas/categorias/route.ts` (W1-C)
- Add a `TopCategoriasTable` component to `src/app/ventas/kpis/page.tsx`

**UI spec:**
```
Rank  Category          Revenue      Units   % Total
 1    Smartphones       $8.200.000   142     41%
 2    Laptops           $5.100.000    38     26%
 3    Auriculares       $2.300.000   201     12%
```
Show top 5. Link to full categorias page (W1-C).

---

### W1-G · Sync Badge (Last Sync Timestamp)

**Value:** Users know when data was last refreshed without having to guess.

**Files to edit:**
- `src/components/layout/Header.tsx` — add sync badge
- `src/app/api/sync/status/route.ts` — read last sync doc from Firestore

**Firestore structure:**
```
Collection: sync_status
Documents:  shopify, gsc, google_ads, crisp, ringcentral
Fields:     { lastSync: timestamp, status: 'ok'|'error', recordsProcessed: number }
```

**UI spec:** Small pill in Header top-right: `🟢 Sincronizado hace 4 min` or `🔴 Error hace 2h`. Clicking opens a popover with all sources and their last sync times.

---

### W1-H · Advanced Date Filter Presets (Filtros Temporales Avanzados)

**Value:** Replace simple month selector with preset buttons. Works across all existing pages.

**Files to create:**
- `src/components/ui/DateRangePicker.tsx` — shared component

**Presets to implement:**
```
[Hoy] [Ayer] [Últimos 7d] [Últimos 30d] [Este mes] [Mes anterior] [Este trimestre] [Custom...]
```

**Implementation:** Controlled component with `startDate`/`endDate` string state. When "Custom..." is selected, show two `<input type="date">` fields. Export as a drop-in replacement for the current date inputs in `ventas/kpis`, `trafico/general`, `trafico/pagado-google` pages.

---

### W1-I · Team Equipo: Date Range Filter + Pagination + Advisor Drill-down

**Value:** Three quick wins in one module — all frontend-only against existing data.

**Files to edit:**
- `src/app/equipo/actividad/page.tsx`
- `src/app/api/equipo/actividad/route.ts` — add `?startDate=&endDate=&advisor=&page=&limit=` params

**Changes:**
1. **Date filter:** Add `DateRangePicker` (W1-H) to the page header.
2. **Pagination:** Add `?page=1&limit=50` to API. Return `{ data, total, page, totalPages }`. Add prev/next buttons.
3. **Advisor drill-down:** Clicking a bar in the productivity chart filters the table to that advisor only. Add an `activeAdvisor` state. Add a clear filter button.

**API pagination query pattern:**
```sql
SELECT * FROM `...shopify_audit_logs`
WHERE created_at BETWEEN @startDate AND @endDate
  AND (@advisor IS NULL OR staff_member = @advisor)
ORDER BY created_at DESC
LIMIT @limit OFFSET @offset
```

---

### W1-J · Real Search Terms from Google Ads (Términos de Búsqueda Reales)

**Value:** Shows exactly what queries triggered paid clicks — critical for adding negative keywords. Google Ads API already connected.

**Files to create:**
- `src/app/api/trafico/terminos-busqueda/route.ts`
- `src/app/trafico/terminos-busqueda/page.tsx`

**Add to Sidebar** under Tráfico → Pagado.

**GAQL query:**
```sql
SELECT
  search_term_view.search_term,
  search_term_view.status,
  metrics.impressions,
  metrics.clicks,
  metrics.cost_micros,
  metrics.conversions,
  metrics.ctr
FROM search_term_view
WHERE segments.date BETWEEN '{start}' AND '{end}'
  AND metrics.impressions > 0
ORDER BY metrics.cost_micros DESC
LIMIT 200
```

**UI spec:** Sortable table with search term, match type, impressions, clicks, CTR, cost, conversions. Filter input to search within results. Color-code: red = high spend + 0 conversions (negative keyword candidates).

---

### W1-K · SKU-Level Performance in Google Ads (Rendimiento por Producto)

**Value:** See which products are eating budget without converting. Google Ads API already connected.

**Files to create:**
- `src/app/api/trafico/sku-performance/route.ts`
- `src/app/trafico/sku-performance/page.tsx`

**GAQL query:**
```sql
SELECT
  shopping_product.item_id,
  shopping_product.title,
  shopping_product.brand,
  metrics.impressions,
  metrics.clicks,
  metrics.cost_micros,
  metrics.conversions,
  metrics.conversions_value,
  metrics.roas
FROM shopping_product
WHERE segments.date BETWEEN '{start}' AND '{end}'
ORDER BY metrics.cost_micros DESC
LIMIT 100
```

**UI spec:** Table with product image placeholder, SKU, title, spend, clicks, conversions, ROAS. ROAS column colored: green > 3, yellow 1-3, red < 1.

---

### W1-L · Brand vs Non-Brand SEO Segmentation (GSC in BigQuery)

**Value:** Separates branded traffic ("gsmpro") from organic discovery. Already in BigQuery `gsc_metrics` table.

**Files to create:**
- `src/app/api/trafico/seo-segmentado/route.ts`
- Section inside `src/app/trafico/organico/page.tsx`

**BigQuery query:**
```sql
SELECT
  query,
  SUM(clicks) as clicks,
  SUM(impressions) as impressions,
  AVG(ctr) as ctr,
  AVG(position) as position,
  CASE
    WHEN LOWER(query) LIKE '%gsmpro%' OR LOWER(query) LIKE '%gsm pro%' THEN 'branded'
    ELSE 'non_branded'
  END as segment
FROM `{GCP_PROJECT_ID}.ecommerce_data.gsc_metrics`
WHERE date BETWEEN @startDate AND @endDate
GROUP BY query, segment
ORDER BY clicks DESC
```

**UI spec:** Toggle tabs [Marca] [No-Marca] [Todas]. KPI cards for each segment (clicks, impressions, avg position). Line chart showing branded vs non-branded clicks over time.

---

## WAVE 2 — GA4 API (set GA4_PROPERTY_ID + GOOGLE_GA4_CREDENTIALS_BASE64)

> Requires enabling the Google Analytics Data API in GCP Console and creating a service account with Viewer access on the GA4 property.

**Shared GA4 client to create:** `src/lib/ga4-client.ts`
```typescript
import { BetaAnalyticsDataClient } from '@google-analytics/data';

let ga4Client: BetaAnalyticsDataClient | null = null;

export function getGA4Client() {
  if (!ga4Client) {
    const credentialsBase64 = process.env.GOOGLE_GA4_CREDENTIALS_BASE64;
    if (!credentialsBase64) throw new Error('GA4 credentials not configured');
    const credentials = JSON.parse(Buffer.from(credentialsBase64, 'base64').toString());
    ga4Client = new BetaAnalyticsDataClient({ credentials });
  }
  return ga4Client;
}

export const GA4_PROPERTY = `properties/${process.env.GA4_PROPERTY_ID}`;
```

**Install:** `npm install @google-analytics/data`

---

### W2-A · Traffic by Channel / Source-Medium

**File:** `src/app/api/trafico/canales/route.ts`

**GA4 dimensions:** `sessionDefaultChannelGrouping`, `sessionSourceMedium`
**GA4 metrics:** `sessions`, `totalUsers`, `conversions`, `purchaseRevenue`

**UI:** Donut chart + table. Add page `src/app/trafico/canales/page.tsx`.

---

### W2-B · Device Breakdown (Mobile vs Desktop)

**File:** `src/app/api/trafico/dispositivos/route.ts`

**GA4 dimensions:** `deviceCategory`
**GA4 metrics:** `sessions`, `totalUsers`, `bounceRate`, `conversions`, `purchaseRevenue`

**UI:** Donut chart (Mobile / Desktop / Tablet) + KPI delta cards. Add section to `src/app/trafico/general/page.tsx`.

---

### W2-C · E-commerce Funnel (Visita → Carrito → Checkout → Compra)

**File:** `src/app/api/trafico/embudo/route.ts`

**GA4 events to query:** `view_item`, `add_to_cart`, `begin_checkout`, `purchase`
**GA4 dimensions:** `eventName`
**GA4 metrics:** `eventCount`, `totalUsers`

**UI:** Horizontal funnel bar chart with drop-off % between steps. New page `src/app/trafico/embudo/page.tsx`.

---

### W2-D · New vs Returning Visitors (Traffic Module)

**File:** `src/app/api/trafico/retencion/route.ts`

**GA4 dimensions:** `newVsReturning`
**GA4 metrics:** `sessions`, `totalUsers`, `engagementRate`, `conversions`

**UI:** Side-by-side KPI cards + donut. Add section to `src/app/trafico/general/page.tsx`.

---

## WAVE 3 — Google Merchant Center API (set MERCHANT_CENTER_ID)

> Enable "Content API for Shopping" in GCP Console. Grant service account access in Merchant Center → Settings → Users.

**Shared client:** `src/lib/merchant-center-client.ts`
```typescript
// Uses googleapis package (already likely installed)
import { google } from 'googleapis';

export function getMerchantClient() {
  const auth = new google.auth.GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/content'],
  });
  return google.content({ version: 'v2.1', auth });
}
```

---

### W3-A · Merchant Center Health Dashboard (Salud de Merchant Center)

**File:** `src/app/api/merchant/health/route.ts`

**API calls:**
- `content.products.list` → count active, disapproved, pending
- `content.productstatuses.list` → get disapproval reasons

**UI spec:**
```
┌──────────┬──────────────┬────────────┐
│ Activos  │  Rechazados  │  Pendientes│
│  1,240   │     42 🔴    │    15      │
└──────────┴──────────────┴────────────┘
Top razones de rechazo:
  • Falta GTIN/EAN — 28 productos
  • Precio incorrecto — 9 productos
  • Imagen no válida — 5 productos
```

New page: `src/app/inteligencia-mercado/merchant/page.tsx`

---

### W3-B · Merchant Center Alerts in SAC Module

**File:** Add Merchant Center rejected count badge to `src/app/servicio-cliente/mensajeria/page.tsx` sidebar card.

---

## WAVE 4 — Vertex AI (same GCP project — enable Vertex AI API)

> No extra key needed if using Application Default Credentials (ADC) via the same service account used for BigQuery.

**Install:** `npm install @google-cloud/aiplatform`

**Shared client:** `src/lib/vertex-client.ts`
```typescript
import { PredictionServiceClient } from '@google-cloud/aiplatform';

export const vertexClient = new PredictionServiceClient({
  apiEndpoint: `${process.env.VERTEX_AI_LOCATION}-aiplatform.googleapis.com`,
});
export const VERTEX_ENDPOINT_PREFIX = `projects/${process.env.GCP_PROJECT_ID}/locations/${process.env.VERTEX_AI_LOCATION}`;
```

---

### W4-A · AI Repricing Suggestions (Sugerencias de Ajuste de Precio)

**File:** `src/app/api/inteligencia-mercado/repricing/route.ts`

**Logic:**
1. Pull competitor prices from `ecommerce_data.competitor_prices` (existing BigQuery table used by competitividad module)
2. Pull own inventory margins from `ecommerce_data.shopify_products`
3. Send to Vertex AI text-bison or gemini-pro with a structured prompt:
   ```
   Given product {name}, competitor average price {X}, our price {Y}, our margin {Z}%,
   suggest an optimal price and reasoning. Return JSON: { suggested_price, reasoning, expected_margin_impact }
   ```
4. Return array of suggestions ranked by potential revenue impact

**UI:** New section in `src/app/inteligencia-mercado/competitividad/page.tsx` — collapsible "AI Suggestions" panel with cards per product.

---

### W4-B · Churn Prediction (Predicción de Fuga)

**File:** `src/app/api/clientes/churn-risk/route.ts`

**Logic:**
1. BigQuery query: customers who bought >18 months ago and have not reordered
2. For each: days since last order, total LTV, number of orders, avg ticket
3. Vertex AI: score churn risk (0-1) using gemini or a custom model
4. Return: ranked list with risk_score, recommended_action

**UI:** New page `src/app/clientes/churn/page.tsx`. Table with customer email (masked), days inactive, LTV, risk badge (High/Med/Low), suggested action.

---

## WAVE 5 — Google My Business / Business Profile API

> Enable "My Business Business Information API" in GCP Console. Requires OAuth 2.0 user consent (not service account).

---

### W5-A · Google Reviews Monitor (Monitoreo de Reputación Google)

**File:** `src/app/api/reputacion/reviews/route.ts`

**API:** `mybusinessreviews.accounts.locations.reviews.list`

**Logic:**
1. GET `/v4/{GMB_LOCATION_ID}/reviews`
2. Return: avgRating, totalReviewCount, last 10 reviews with text + rating + date

**UI:** New widget in `src/app/servicio-cliente/mensajeria/page.tsx` — star rating summary + scrollable recent reviews list. Highlight reviews with rating ≤ 3 in red.

---

## WAVE 6 — Google Sheets Export (GOOGLE_SHEETS_GOALS_ID)

### W6-A · Export to Google Sheets Button

**Applicable pages:** `ventas/kpis`, `trafico/general`, `equipo/actividad`

**File:** `src/lib/sheets-export.ts`

**Install:** `npm install googleapis` (likely already present)

**Logic:**
```typescript
// Accept: sheetName, headers[], rows[][]
// 1. google.auth.GoogleAuth with sheets scope
// 2. sheets.spreadsheets.values.append to GOOGLE_SHEETS_GOALS_ID
// Returns: { url: string } — link to the sheet
```

**UI:** Replace or complement existing CSV export button with a dropdown:
```
[↓ Exportar ▾]
  • Descargar CSV
  • Abrir en Google Sheets
```

---

## EXECUTION ORDER (recommended for Claude Code)

```
1. W1-H  DateRangePicker component (shared dep for everything)
2. W1-G  Sync Badge (quick win, very visible)
3. W1-A  MoM/YoY delta badges (high impact on existing cards)
4. W1-B  Goals / Pacing bar + Forecast (needs Firestore write)
5. W1-C  Sales by Category (new BigQuery query + new page)
6. W1-D  New vs Returning Customers
7. W1-E  Sales by Payment Method
8. W1-F  Top Categories KPI table (reuses W1-C data)
9. W1-I  Equipo: date filter + pagination + drill-down
10. W1-J  Real Search Terms — Google Ads
11. W1-K  SKU Performance — Google Ads
12. W1-L  Brand vs Non-Brand SEO
── Add GA4 credentials ──
13. W2-A  Traffic by Channel
14. W2-B  Device Breakdown
15. W2-C  E-commerce Funnel
16. W2-D  New vs Returning Visitors
── Add Merchant Center credentials ──
17. W3-A  Merchant Center Health
18. W3-B  Merchant alerts in SAC
── Enable Vertex AI ──
19. W4-A  AI Repricing Suggestions
20. W4-B  Churn Prediction
── GMB OAuth ──
21. W5-A  Google Reviews Monitor
── Sheets ID ──
22. W6-A  Export to Google Sheets
```

---

## NOTES FOR CLAUDE CODE

- All BigQuery table names follow pattern: `{GCP_PROJECT_ID}.ecommerce_data.{table}`
- Known confirmed tables: `shopify_orders`, `shopify_traffic_daily`, `gsc_metrics`, `shopify_audit_logs`
- Assumed tables (verify exist before querying): `shopify_order_line_items`, `shopify_products`, `competitor_prices`
- If a table does not exist, create a BigQuery API route that returns `{ success: false, error: 'table_not_found', message: '...' }` and render a placeholder UI card with a "Data not yet available" state.
- All new API routes must follow the pattern: `return NextResponse.json({ success: true, data: {...} })`
- All new pages must be `'use client'` and follow the existing fetch pattern in `ventas/kpis/page.tsx`
- Date params: always `?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`
- Auth: all pages are protected by Firebase Auth via the existing middleware/layout — no extra auth code needed on new pages
- Use existing Recharts setup (AreaChart, BarChart, PieChart, Cell) — do not add new charting libraries
- Use existing Tailwind classes and `cn()` utility from `src/lib/utils.ts`
- Use existing Lucide React icons — do not add new icon libraries
