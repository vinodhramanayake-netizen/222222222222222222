# InsightBoard

A single-page, **fully static** support & product analytics demo dashboard built
with Next.js + TypeScript. All metrics are deterministically generated demo data
from a single `seed` — there are **no backend, no APIs, and no runtime network
calls**. The site is exported as static assets (`output: 'export'`) for Vercel.

> ⚠️ **Demo Data** — every value shown is synthetic and for demonstration only.

## Tech stack

- **Next.js 15** (App Router, static export)
- **React 18** + **TypeScript** (strict, no `any`)
- **Recharts** for the tickets line chart; lightweight inline SVG for gauges
- **CSS Modules + CSS custom properties** mapped from the DS1 design system
  (`design-system-ds1-tokens.json`)
- **Inter** font, self-hosted at build time via `next/font` (no font CDN at runtime)
- **lucide-react** icons (bundled)
- **Vitest** for unit tests; **ESLint** (incl. `jsx-a11y`) + **Prettier**

## Scripts

| Script              | Description                                  |
| ------------------- | -------------------------------------------- |
| `npm run dev`       | Start the local dev server                   |
| `npm run build`     | Produce the static export in `./out`         |
| `npm run typecheck` | `tsc --noEmit`                               |
| `npm run lint`      | ESLint (Next core-web-vitals + jsx-a11y)     |
| `npm run test`      | Run Vitest unit tests                        |
| `npm run format`    | Format with Prettier                         |
| `npm run verify`    | typecheck → lint → test → build (mirrors CI) |

## Project structure

```
src/
  app/            # App Router: layout, root page, global CSS
  styles/         # DS1 tokens as CSS custom properties
  lib/            # Typed token mirror; (seeded data generator added next)
  components/
    primitives/   # AppShell, Card, Typography helpers
```

## Constraints enforced

- **Static export**: `next.config.mjs` sets `output: 'export'` and
  `images.unoptimized`.
- **No runtime network**: ESLint forbids `fetch`/`XMLHttpRequest`; the font is
  self-hosted; data is generated in-browser from the seed.
- **Accessibility**: `eslint-plugin-jsx-a11y`, semantic landmarks, focus-visible
  rings, reduced-motion support.
- **CI** (`.github/workflows/ci.yml`) runs typecheck, lint, tests and the static
  build on every push/PR.
