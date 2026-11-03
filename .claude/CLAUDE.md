# Meridian Works MES — Project Constitution for the Dev Team

Packaging & cobalting execution system for safety-glove manufacturing.
Full-stack: vanilla TS/HTML/CSS frontend (`src/main.ts`, 5 screens), Express
API (`server.ts` → `src/routes/api.js` → `src/services/packingService.js`),
SQLite via node:sqlite (`data/gloves_packing.db`), Docker runtime
(`Dockerfile`, `docker-compose.yml`).

## Non-negotiables

- **Grayscale only.** Every color must come from the CSS variables in
  `src/style.css` (`--ink-*`, `--bg-*`, `--border-*`, `--text-*`). Never
  introduce a new hex literal in markup or new CSS. Zero-color-tolerance rule:
  the entire UI, including print templates and SVG, stays monochrome.
- **Clean inspection mode.** No dummy/demo transaction rows. `seedDemoSheet()`
  in `src/db.js` is intentionally disabled; do not re-enable it, do not seed
  fake receivings, defects, or cartons. Reference masters (customers,
  products, materials, BOM) may be seeded as before.
- **Print engine.** Slips print through `#direct-print-stage` +
  `body.printing-slip` + native `window.print()` (defined in `src/main.ts`,
  mirrored in `src/App.tsx`). Keep `@media print` rules in `src/style.css`.
- **Entry point.** `index.html` loads `/src/main.ts` (vanilla 5-screen app:
  grn, packing, repair, qc, admin). `src/App.tsx`/`main.tsx` is the React
  harness kept out of the served entry; do not switch entries without intent.
- **Docker parity.** `docker compose build` must succeed and the container
  must pass `/health` before a task is considered done.

## Quality gates (run before done)

- `npx tsc --noEmit` — typecheck
- `npx vite build` — frontend bundle builds
- `docker compose build` + `curl -f http://127.0.0.1:3000/health`

## Workflow

Use the dev-team plugin from https://github.com/bdfinst/agentic-dev-team
(vendored at `.agentic-dev-team/`, catalog in `skills.md`):

    /specs  →  /plan  →  /build  →  /pr

Human gates sit between /specs→/plan and /plan→/build. Bug fixes may start at
/plan or go straight to implementation. Run /code-review before every commit.
