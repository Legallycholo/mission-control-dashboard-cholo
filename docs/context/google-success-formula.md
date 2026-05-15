# The Google Success Formula
**Author:** Joaquin Calderon — Shopify Scaling · Google Ads Strategy · Revenue Forecasting
**Version:** 2026 Edition

---

## The Formula

**Estimated Revenue = MSV × CTR_Top3 × SoV × CR × AOV**

This converts a vague "how much can we grow?" question into a hard number grounded in actual search demand.

---

## The Five Variables

| Variable | Name | Definition | 2026 Benchmark |
|---|---|---|---|
| **MSV** | Monthly Search Volume | Total monthly searches for target keywords | From Google Keyword Planner |
| **CTR Top 3** | Click Capture Rate | % of searchers clicking positions 1–3 | **47%** (conservative, AI-Overview-aware) |
| **SoV** | Share of Voice | % of Top 3 clicks your ads actually capture | 20% (new) → 85–95% (mature) |
| **CR** | Conversion Rate | % of visitors who become buyers | 2.81% eCommerce search ads benchmark |
| **AOV** | Average Order Value | Average revenue per order | From your actual Shopify reports |

---

## CTR Data (2026)

| Position | Clean SERP | With AI Overview |
|---|---|---|
| Position 1 | 39.8% | 27.6% |
| Position 2 | 18.7% | 12.4% |
| Position 3 | 10.2% | 6.7% |
| **Top 3 Total** | **68.7%** | **46.7%** |
| Positions 4–10 | ~10% | ~7% |

**We use 47% as the planning constant** (AI Overview-aware, conservative).
Paid Shopping/Search Ads appear ABOVE AI Overview boxes — partially bypassing CTR compression.

---

## Three Scenario Model

Example: MSV 10,000 · AOV $150 · CR 2.8% · CTR 47%

| Scenario | SoV | Monthly Clicks | Orders/mo | Est. Revenue/mo |
|---|---|---|---|---|
| Pessimistic | 20% | 940 | 26 | $3,950 |
| Conservative | 50% | 2,350 | 66 | $9,870 |
| Optimistic | 85% | 3,995 | 112 | $16,780 |

- **Pessimistic (20%):** Floor — use for cash-flow planning
- **Conservative (50%):** Realistic target, achievable in 90 days
- **Optimistic (85%):** Ceiling — plan for 6–12 months out

---

## Seasonality (Chilean eCommerce context)

| Month | Trend | Implication |
|---|---|---|
| Jan | -10 to -15% | Post-holiday dip |
| Feb–Mar | +5 to +10% | Testing window |
| Apr–May | Gift season spike | Mother's Day surge |
| Jun–Aug | Plateau | B2B drops; lifestyle peaks |
| Sep–Oct | +15 to +20% | Pre-Q4 ramp — highest leverage |
| Nov | +50 to +80% | CyberDay/BFCM — highest CPCs AND highest CR |
| Dec | Holiday peak then sharp drop | Last-minute + returns |

---

## How This Applies to GSM Pro Mission Control

The **Dimensión de Mercado** module (`/inteligencia-mercado/dimension`) implements this formula:
- Uses Google Ads API MSV as market size proxy
- Calculates Market Share (our SoV) vs total demand
- The Pessimistic/Conservative/Optimistic scenario modeling should be surfaced as a dedicated visualization

The **POAS (Profit on Ad Spend)** module in `/trafico/pagado-google` extends this by crossing
Google Ads spend with COGS — showing true margin-based return, not just revenue ROAS.

---

## Key 2026 Benchmarks
- eCommerce CPC: $1.16–$1.50 (WordStream)
- Cross-industry CPC: $5.26
- eCommerce Search Ads CVR: 2.81% (Store Growers)
- Cross-industry Google Ads CVR: 7.52% (WordStream)
- CPCs up 5–9% YoY in 87% of industries
