# Inteligencia de Mercado — Design Plan
**Source:** marketing_intelligence_plan.md (working folder)

## Objective
Separate "Inteligencia de Mercado" from the main dashboard into its own dedicated tab with a
distinct **AI-centric dark-mode aesthetic** — different from the white/zinc light theme of all other modules.

---

## Design System — Color Palette

| Token | Value | Usage |
|---|---|---|
| `--bg-ai-dark` | `#0f0f0f` | Main wrapper background |
| `--bg-ai-surface` | `#1e1e1e` | Cards/surfaces |
| `--text-ai-primary` | `#ffffff` | Headings |
| `--text-ai-secondary` | `#e0e0e0` | Body text |
| Accent: Cyan | `#00f5ff` approx | Primary neon accent |
| Accent: Magenta | `#ff00ff` approx | Secondary accent |
| Accent: Deep Purple | `#7c3aed` approx | Tertiary |
| Accent: Peach | `#fbbf24` approx | Warning/highlight |

**Key CSS classes:**
- `.bg-gradient-aurora` — for solid backgrounds and active nav states
- `.border-gradient-glow` — glowing gradient edges on cards (intensifies on focus/hover)

---

## Navigation
- Active state: glowing, multi-color gradient indicator
- Visually differentiated from standard sidebar items
- Should feel like entering a separate "AI" zone of the dashboard

---

## Charts & Visualizations
- Override Recharts colors with neon palette (cyan, purple, orange) for this module only
- Tooltips: muted colors so neon data lines stay focal
- Grid lines: subtle, low-opacity
- No color bleed into other modules (scoped CSS)

---

## Implementation Phases
1. **Phase 1:** Structural routing — ensure `/inteligencia-mercado/*` routes are independent
2. **Phase 2:** Define CSS variables scoped to this layout
3. **Phase 3:** Style cards with dark surfaces + glowing gradient borders
4. **Phase 4:** Update chart configs with neon palette
5. **Phase 5:** QA — cross-browser gradient check, WCAG contrast for white-on-dark

---

## Current State (as of 2026-05-14)
The `/inteligencia-mercado` section already has its own pages. The dark AI aesthetic has been
partially applied (visible in the existing UI). Three sub-modules are blocked pending API access:
- **Dimensión de Mercado** — blocked: Google Ads Basic Access pending approval
- **Competitividad** — blocked: SerpApi free plan (250/mo) exhausted
- **Tendencias** — blocked: same SerpApi dependency
