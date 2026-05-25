# Mission Control Dashboard

Developer documentation for the GSMPRO mission-control platform: a business dashboard with data ingestion jobs and a product-intelligence service.

## What this project is

This repository combines:

- A `Next.js` dashboard (`dashboard/`) for internal teams (admin, ventas, trafico, marketing, soporte, etc.).
- Node.js data ingestion and ops scripts (`scripts/`) that sync external sources into BigQuery.

In short: this is an internal analytics + operations control center running in Next.js-first mode.

## Stack

### Frontend + API layer

- `Next.js 16` (App Router)
- `React 19`
- `TypeScript`
- `Tailwind CSS 4`
- `Recharts` + `Framer Motion`

### Services + data processing

- `Node.js` scripts for ETL/sync jobs
- `Google Cloud BigQuery`
- `Google APIs` (Shopify/marketing ingestion workflows via Node tooling)

### Infrastructure

- `Google Cloud Run` as production runtime
- `Vercel` used for staging/preview workflows
- Environment management through root `.env` (local) and `env.yaml` (Cloud Run)

## Repository structure

```text
.
├── dashboard/                      # Next.js app (UI + route handlers)
│   ├── src/app/                    # App routes and pages
│   ├── src/components/             # Reusable UI components
│   ├── src/lib/                    # Shared frontend/server utilities
│   └── package.json
├── scripts/                        # Data ingestion, sync, and DDL scripts
│   ├── sync-*.js                   # Production sync jobs (Shopify, Crisp, Klaviyo, GSC…)
│   ├── lib/                        # Shared helpers (e.g. shopify-graphql)
│   ├── sql/                        # BigQuery DDL + views
│   ├── debug/                      # One-off debug/diagnostic scripts
│   └── tests/                      # Connectivity / smoke test scripts
├── services/
│   └── product_intelligence/       # Python FastAPI service (BigQuery + GenAI)
├── docs/                           # Agent skills + project docs
│   ├── context/                    # Strategic context + reference PDFs
│   ├── .agents/                    # Cursor/Claude agent skill configs
│   └── project/                    # Roadmap, architecture, changelog, specs
├── package.json                    # Root orchestrator scripts
└── env.yaml                        # Production env vars for Cloud Run deploys
```

## Project docs index

- `docs/project/ROADMAP.md`
- `docs/project/CHANGELOG.md`
- `docs/project/PRODUCTION_ARCHITECTURE.md`
- `docs/project/MARKET_INTELLIGENCE_SPECS.md`
- `docs/project/DASHBOARDGOOGLE.md`
- `docs/project/ACCESSING_PRIOR_REPOSITORY_VERSION.md`

## Local development

### Prerequisites

- Node.js + npm
- Google Cloud credentials with BigQuery access
- Root `.env` configured with required keys (for example `GCP_PROJECT_ID`)

### Install

```bash
npm install
cd dashboard && npm install
```

### Run locally

From repository root:

```bash
npm run dev            # Next.js app
```

## Common developer commands

```bash
# Dashboard
cd dashboard
npm run dev
npm run build
npm run lint

# Root sync jobs
npm run sync:shopify
npm run sync:klaviyo
npm run sync:crisp
npm run sync:gsc

# Attribution DDL setup
node scripts/apply-attribution-ddl.js

# Audit log sync examples
node scripts/sync-audit-log.js
node scripts/sync-audit-log.js --backfill=7d
node scripts/sync-audit-log.js --dry-run
```

## Deployment notes

- Production source of truth is Cloud Run.
- Keep critical deploy env vars in `env.yaml`; avoid ad-hoc `--set-env-vars` usage.
- Market-intelligence scan trigger is currently disabled while running Next.js-only mode.

Example production deploy command:

```bash
gcloud run deploy dashboard-gsmpro-ui \
  --source . \
  --region us-east1 \
  --env-vars-file ../env.yaml \
  --project atomic-box-494614-r5
```
