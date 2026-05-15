# GSM Pro Dashboard — Stack Tecnológico
**Critical rules for all developers and AI agents working on this project.**

---

## Core Stack (MANDATORY — no substitutions without architecture approval)

| Layer | Technology |
|---|---|
| Frontend + BFF | Next.js (App Router) + TypeScript |
| Styling | Tailwind CSS + Shadcn/UI components |
| Charts | Recharts |
| Icons | Lucide Icons |
| Database (ONLY) | Google BigQuery — ALL data centralized here |
| AI Microservices | Python (Vertex AI / GenAI SDK) in `services/` |
| Infrastructure | Google Cloud Run + Docker |
| Version Control | GitHub — PRs required for all production deploys |

**PROHIBITED:**
- PostgreSQL, MySQL, MongoDB, Firebase DB, Supabase, Prisma ORM
- Redux (use Zustand for complex global state, React Context for simple)
- Third-party auth providers (Auth0, Firebase Auth, JWT custom) — IAP handles this
- Node.js cron libraries — use Google Cloud Scheduler only
- Hardcoded credentials anywhere in code

---

## Authentication & Security (Zero Trust)

- **Identity-Aware Proxy (IAP):** All auth delegated to Google Cloud IAP at Load Balancer level
- **Session resolution:** `x-goog-authenticated-user-email` header → `/api/auth/me`
- **Roles (RBAC):**
  - Admin: domains `proshoproyal.net`, `tanygrowth.com`, `growth.com` (set in `.env`)
  - Viewer: any other IAP-validated corporate account (read-only)
- **Secrets:** Secret Manager in production, `.env.local` in development only

---

## Authorized Data Integrations

| Platform | Purpose | Method |
|---|---|---|
| Shopify | E-Commerce base | GraphQL API (primary), REST (fallback) |
| Google Ads | Paid traffic + Market Intelligence | Google Ads API |
| Google Search Console | Organic traffic | GSC API |
| Meta Ads | Social ads | BigQuery Transfer or API (pending) |
| Klaviyo | Email marketing | Klaviyo API |
| SerpApi | Market intelligence scraping (Google Shopping) | SerpApi REST |
| Crisp.chat | Customer messaging | Crisp API + webhooks |
| RingCentral | Phone calls | RingCentral API |

---

## Development Principles

1. **All heavy logic in BigQuery** — JOINs, KPI calculations, attribution → SQL views
   Next.js BFF does simple `SELECT` on optimized views only
2. **Parameterized queries only** — no SQL string concatenation (SQL injection prevention)
3. **No simulated data or hardcoded multipliers** — if data is wrong, fix the BigQuery view or sync script
4. **Code must pass** `npm run build` + `tsc --noEmit` before any push to production
5. **All AI-generated code must be reviewed** — no black boxes

---

## CI/CD & Deployment

- Production deploys: PR → Docker build → `gcloud run deploy` (no manual deploys)
- All DDL migrations documented in `scripts/sql/` and `project_timeline.md`
- Monitoring: Google Cloud Logging + Error Reporting (no third-party APM without justification)

---

## Lesson Learned (Do Not Repeat)

**Supabase incident:** Adding `@supabase/ssr` caused severe Webpack cache conflicts, blocked builds,
and complicated RBAC. **Do not install any BaaS package** (Supabase, Firebase, Auth0, Prisma).
This is a 100% Google Cloud Platform / BigQuery / Cloud Run ecosystem.
