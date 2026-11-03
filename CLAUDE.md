# Meridian Works MES

Packaging & cobalting execution system for safety-glove manufacturing.

- Frontend: vanilla TS/HTML/CSS — `index.html` loads `src/main.ts`; five
  screens (Inward Register, Packing Hall, Repair Bay, Final QC, Admin).
- Backend: Express (`server.ts`) → `src/routes/api.js` →
  `src/services/packingService.js`; SQLite via `node:sqlite` in `data/`.
- Styling: strict grayscale CSS variables (`--ink-*`, `--bg-*`, `--border-*`,
  `--text-*`) defined in `src/style.css`. No new hex colors, ever.
- Clean inspection mode: no dummy/demo transaction data; masters only.
- Print: GRN and other slips print via `#direct-print-stage` +
  `body.printing-slip` + `window.print()`; `@media print` rules in style.css.
- Docker: `docker compose up -d --build`; health endpoint `/health`.

## Commands

| Task | Command |
| --- | --- |
| Dev server (Vite + API, port 3000) | `npm run dev` |
| Typecheck | `npm run lint` |
| Frontend build | `npm run build` |
| Unit tests (node:test) | `npm test` |
| Docker run | `docker compose up -d --build` |

## Development workflow

This project uses the **dev-team** plugin from
https://github.com/bdfinst/agentic-dev-team — vendored in
`.agentic-dev-team/plugins/dev-team/`, cataloged in `skills.md`:

    /specs → /plan → /build → /pr

Human gates between /specs→/plan and /plan→/build. `/code-review` before every
commit. See `.claude/CLAUDE.md` for the full project constitution
(grayscale gate, clean-mode gate, quality gates).
