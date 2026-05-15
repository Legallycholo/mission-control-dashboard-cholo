# Sidebar Reorganization Plan
**File to edit:** `dashboard/src/components/layout/Sidebar.tsx`
**Rule:** No deletions — only fix broken links, add missing items, rename for clarity.

---

## Current Problems

### 1. Marketing section — all 3 sub-links are broken (404)
Current (broken):
- "Email" → `/marketing/email` ❌ (page does not exist)
- "Ads" → `/marketing/ads` ❌ (page does not exist)
- "Otros" → `/marketing/otros` ❌ (page does not exist)

The existing page at `/marketing/page.tsx` (Klaviyo + GSC overview) is NOT linked anywhere in the sidebar.

### 2. Tráfico section — one fully implemented page is missing from sidebar
- `/trafico/terminos-busqueda` is complete (filtering, sorting, negative keywords, CSV export)
- It is NOT listed in the Tráfico sidebar section at all

### 3. Finanzas / Compras / Operaciones / Clientes — all sub-links 404
None of these pages exist yet. Clicking any sub-item throws a Next.js 404.

---

## Proposed Sidebar Structure (no deletions)

```
General                           → /dashboard ✅

Ventas
  Indicadores (KPIs)              → /ventas/kpis ✅
  Análisis de Productos           → /ventas/productos ✅
  Por Categoría                   → /ventas/categorias ✅
  Nuevos vs Recurrentes           → /ventas/retencion ✅
  Métodos de Pago                 → /ventas/metodo-pago ✅

Inteligencia de Mercado
  Resumen                         → /inteligencia-mercado ✅
  Tendencias                      → /inteligencia-mercado/trends ✅
  Competitividad                  → /inteligencia-mercado/competitividad ✅ (blocked: SerpApi)
  Dimensión de Mercado            → /inteligencia-mercado/dimension ✅ (blocked: Google Ads access)
  Posicionamiento Shopping        → /inteligencia-mercado/shopping-position ✅
  Lanzamientos                    → /inteligencia-mercado/lanzamientos ✅

Tráfico
  General                         → /trafico/general ✅
  Orgánico (Search Console)       → /trafico/organico ✅
  Pagado (Google Ads)             → /trafico/pagado-google ✅
  Términos de Búsqueda            → /trafico/terminos-busqueda ✅ ← ADD THIS (fully built)
  SKU Performance                 → /trafico/sku-performance ✅
  Pagado (Meta Ads)               → /trafico/pagado-meta ✅ (placeholder "En Construcción")

Marketing
  Email & Push (Klaviyo)          → /marketing ✅ ← FIX: was /marketing/email (doesn't exist)
  Auditoría de Colecciones        → coming soon (keep entry, mark pending)
  Calendario Comercial            → coming soon (keep entry, mark pending)

Servicio al Cliente
  Mensajería CRM (Crisp)          → /servicio-cliente/mensajeria ✅
  Llamadas (RingCentral)          → /servicio-cliente/llamadas ✅

Equipo
  Actividad y Atribución          → /equipo/actividad ✅

Finanzas                          (all pending — no pages exist)
  Márgenes y P&L                  → /finanzas/pnl (coming soon)
  Gastos Fijos                    → /finanzas/gastos (coming soon)

Compras                           (all pending — no pages exist)
  Órdenes de Compra               → /compras/ordenes (coming soon)
  Proveedores                     → /compras/proveedores (coming soon)

Operaciones                       (all pending — no pages exist)
  Inventario y Stock              → /operaciones/inventario (coming soon)
  Fulfillment                     → /operaciones/fulfillment (coming soon)
  Devoluciones                    → /operaciones/devoluciones (coming soon)

Clientes                          (all pending — no pages exist)
  Retención (LTV)                 → /clientes/retencion (coming soon)
  Segmentación                    → /clientes/segmentacion (coming soon)

Vendor Intelligence
  Proveedores (Coming Soon)       → /vendor-intelligence ✅ (keep as-is)

Configuración
  Preferencias                    → /settings ✅
```

---

## Changes Required in `Sidebar.tsx`

### Change 1 — Fix Marketing links
```
BEFORE:
  { name: 'Email', href: '/marketing/email' },
  { name: 'Ads', href: '/marketing/ads' },
  { name: 'Otros', href: '/marketing/otros' },

AFTER:
  { name: 'Email & Push (Klaviyo)', href: '/marketing' },
  { name: 'Auditoría de Colecciones', href: '/marketing/auditoria' },  ← coming soon
  { name: 'Calendario Comercial', href: '/marketing/calendario' },     ← coming soon
```

### Change 2 — Add Términos de Búsqueda to Tráfico
```
BEFORE (Tráfico subItems):
  { name: 'General', href: '/trafico/general' },
  { name: 'Orgánico (Search Console)', href: '/trafico/organico' },
  { name: 'Pagado (Google Ads)', href: '/trafico/pagado-google' },
  { name: 'Términos de Búsqueda', href: '/trafico/terminos-busqueda' },  ← MISSING
  { name: 'SKU Performance', href: '/trafico/sku-performance' },
  { name: 'Pagado (Meta Ads)', href: '/trafico/pagado-meta' },

AFTER: add the Términos de Búsqueda line (it's already in the sidebar code but check)
```

### Change 3 — Finanzas/Compras/Operaciones/Clientes coming soon pages
Option A: Create a single shared `/coming-soon` page and point all broken links there.
Option B: Create individual placeholder pages (like `/trafico/pagado-meta` does) for each section.
Option B is better — each module can have its own "En Construcción" card with the feature list.

---

## Sidebar Order Rationale
The current top-to-bottom order maps to the business workflow:
1. **Ventas** — "how much are we selling?" (foundation)
2. **Inteligencia de Mercado** — "what is the market doing?" (strategic)
3. **Tráfico** — "where are visitors coming from?" (acquisition)
4. **Marketing** — "how are our campaigns performing?" (execution)
5. **Servicio al Cliente** — "how are we serving buyers?" (retention)
6. **Equipo** — "who is doing what?" (operations)
7. **Finanzas** — "what is the net profit?" (financial health)
8. **Compras** — "what are we buying from suppliers?" (procurement)
9. **Operaciones** — "how is inventory and fulfillment?" (logistics)
10. **Clientes** — "who are our best customers?" (CRM/LTV)

This order is logical and should be kept as-is.
