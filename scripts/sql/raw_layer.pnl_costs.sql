-- BigQuery table for manual P&L cost entries
-- Run once in GCP Console: bq query --use_legacy_sql=false < raw_layer.pnl_costs.sql

CREATE TABLE IF NOT EXISTS `${GCP_PROJECT_ID}.ecommerce_data.pnl_costs` (
  id          STRING    NOT NULL,
  period      STRING    NOT NULL,   -- 'YYYY-MM' e.g. '2026-05'
  category    STRING    NOT NULL,   -- 'COGS' | 'OPEX' | 'GATEWAY' | 'SHIPPING' | 'MARKETING' | 'OTHER'
  name        STRING    NOT NULL,   -- e.g. 'Costo de Mercadería', 'Arriendo Bodega'
  amount_usd  FLOAT64   NOT NULL,
  notes       STRING,
  created_at  TIMESTAMP NOT NULL,
  updated_at  TIMESTAMP NOT NULL
)
PARTITION BY DATE_TRUNC(PARSE_DATE('%Y-%m', period), MONTH)
OPTIONS (
  description = 'Manual cost inputs for the P&L module. One row per cost line per month.'
);
