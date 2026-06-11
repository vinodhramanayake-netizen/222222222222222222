# CLAUDE.md — InsightBoard

Guidance for working in this repo. Keep this file lean.

## What this is

A single-page, **fully static** support & product analytics **demo** dashboard.
Next.js (App Router) static export → deployed to Vercel as plain assets. Every
metric is **synthetic demo data** generated in-browser from a single numeric
`seed`. There is **no backend, no database, no auth, no runtime network**.

Audience: internal demos / stakeholder presentations / UI reference.

## Non-negotiable constraints

1. **Static export only** — `next.config.mjs` sets `output: 'export'` and
   `images.unoptimized`. No API routes, no server components needing a runtime,
   no dynamic server features.
2. **Zero runtime network calls** — no `fetch`/`XHR`, no analytics SDKs, no
   tracking pixels, no third-party cookies, no runtime font/CDN loads. ESLint
   bans `fetch`/`XMLHttpRequest` via `no-restricted-globals`. Fonts are
   self-hosted at build time (`next/font`). Verify after builds: no
   `fonts.googleapis`/`gstatic` refs in `out/`.
3. **Single seed drives everything** — all widgets read from one
   `DemoDashboardData` object produced by a deterministic seeded PRNG. Same seed
   ⇒ identical output (tests must prove this; inject/freeze time to avoid flake).
4. **Persistent "Demo Data" banner** must always be visible.
5. **Bundle < 500 KB gzipped** (best-effort guardrail). Currently ~103 kB First
   Load JS. Keep Recharts tree-shaken; gauges are lightweight inline SVG, not a
   chart lib.
6. **Accessibility (WCAG AA)** — semantic landmarks, keyboard-operable controls,
   focus-visible rings, chart ARIA labels / visually-hidden data tables. Lint
   with `jsx-a11y`.
7. **TypeScript strict, no `any`** — explicit prop types everywhere.

## Tech & conventions

- **Next.js 15** App Router, **React 18**, **TypeScript** (strict +
  `noUncheckedIndexedAccess`). Path alias `@/*` → `src/*`.
- **Recharts 2.x** for the dual-line tickets chart only. Gauges/bars/progress =
  hand-rolled SVG/CSS.
- **lucide-react** for icons (DS1 icon library; bundled).
- **Styling**: CSS Modules per component + DS1 tokens as **CSS custom
  properties** in `src/styles/tokens.css` (dark default, `[data-theme='light']`
  available). Never hard-code colors/spacing in components — use the vars.
  - `src/lib/tokens.ts` is the **typed mirror** of those tokens for JS consumers
    (Recharts color props, breakpoints). Keep the two files in lockstep.
- **Tooling**: ESLint (`next/core-web-vitals` + `@typescript-eslint` +
  `jsx-a11y`), Prettier (single quotes, semi, 2-space, width 80), **Vitest**
  (jsdom) for unit tests.
- Keep config (palettes, KPI defs, time-range options) in typed constant files,
  not scattered in components. Avoid premature abstraction. Document each KPI
  with an inline comment on how it's derived from demo data.

## Layout (AC summary)

3-column **CSS grid at ≥1280px** (DS1 `xl` breakpoint, `DESKTOP_GRID_MIN_WIDTH`):

- **Left**: KPI panel — CSAT radial gauge (70–100%, needle, green healthy arc),
  First Response Time + Avg Resolution Time (headline + delta badge).
- **Center**: Tickets-by-tag list (6–7 rows, cyan bars, sorted desc), customer
  feedback carousel (keyboard + dot pagination), Mon–Sun dual-line tickets chart
  (Received=blue, Solved=amber, Y 0–400 step 100, mid-week peak).
- **Right**: New users + Reports created stat cards (green ▲ delta), churn
  semicircular gauge (0–50%, red high-risk arc on right, needle), LTV card with
  progress bar to a labeled target.

Below 1280px: wrap the grid in a **deliberate horizontal-scroll container** (no
stacked mobile layout required). Week is **always Mon–Sun**. Regenerate updates
the seed **and** the `?seed=` URL query; show seed + "Last generated" timestamp.

## Data model (`DemoDashboardData`)

```
seed: number
generatedAtIso: string
weekDates: { dayLabel, dateLabel, isoDate }[]   // Mon–Sun, dateLabel like '22 May'
support: {
  csatPercent: number
  frt: { valueMinutes, display, deltaPct }       // display like '1h 12m'
  art: { valueMinutes, display, deltaPct }
  ticketsByTag: { tag, count }[]
  feedback: { id, text, createdAtIso }[]
  ticketsSeries: { dateLabel, received, solved }[]
}
product: {
  newUsers: { count, deltaPct }
  reportsCreated: { count, deltaPct }
  churnPercent: number
  ltv: { valueUsd, targetUsd }
}
```

## Commands

| Command             | Purpose                                      |
| ------------------- | -------------------------------------------- |
| `npm run dev`       | Local dev server                             |
| `npm run build`     | Static export → `./out`                      |
| `npm run typecheck` | `tsc --noEmit`                               |
| `npm run lint`      | ESLint (core-web-vitals + jsx-a11y)          |
| `npm run test`      | Vitest                                       |
| `npm run format`    | Prettier write                               |
| `npm run verify`    | typecheck → lint → test → build (mirrors CI) |

Always run `npm run verify` before committing. CI
(`.github/workflows/ci.yml`) runs the same and asserts `out/index.html`.

## Structure

```
src/
  app/            layout.tsx (font+theme), page.tsx (DashboardPage), globals.css
  styles/         tokens.css (DS1 → CSS custom properties)
  lib/            tokens.ts (typed token mirror); seeded data generator (added Step 2)
  components/
    primitives/   AppShell, Card, Typography (+ .module.css), index.ts barrel
```

## Design source of truth

`files/design-system-ds1-tokens.json` (DS1): brand `#7c5cfc`, semantic colors,
Inter type scale, spacing/radii/shadows/motion, 2px focus ring, 44px touch
target, Lucide icons. Match it visually; reuse the primitives above.

## Build roadmap (story steps)

1. ✅ Scaffold: static export, DS1 tokens, primitives, tooling, CI.
2. Deterministic seeded data system + seed lifecycle (URL `?seed=`, default seed
   once/load, Regenerate updates seed+URL, "Last generated"). Unit-tested.
3. DashboardPage layout: 3-col grid, responsive horizontal scroll, Demo banner.
4. Left + right column widgets (CSAT/FRT/ART, stat cards, churn gauge, LTV).
5. Center widgets (tickets-by-tag, feedback carousel, dual-line chart) + a11y.
6. Final verification against the full story.
