# Packing Execution System (MES) & Store Register

An offline-first manufacturing execution system for a glove-packing operation. It covers dock receiving, a five-stage packing pipeline, closed-loop rework control, AQL final QC, master carton manifests, and a dual-store requisitions ledger.

## Stack

- **Runtime:** Node.js 22+ (uses the built-in `node:sqlite` `DatabaseSync`)
- **Backend:** Express REST API
- **Frontend:** Vanilla HTML5 / CSS / ES6+, with an optional React + Vite shell
- **Database:** SQLite in WAL mode with foreign keys and indexes
- **Tests:** Node's native `node:test` runner
- **Deployment:** Docker / Docker Compose, or a local Node process

## Getting started

```bash
npm install
npm start            # http://127.0.0.1:3000
```

Vanilla UI server (no Vite, no build step):

```bash
node src/server.js   # http://127.0.0.1:3050
```

The database is created schema-first and seeded with demo records on first run under `data/`. That directory is git-ignored. Delete `data/gloves_packing.db*` to reset to a clean seed.

Health check: `GET /health`.

On Windows, `Start-Packing-System.bat` (or the compiled `Program.cs` launcher)
starts the same app and opens `http://127.0.0.1:3000`. If a server is already
healthy on that port (for example the Docker container), it reuses it instead
of starting a second process.

## Tests

```bash
npm test
npm run lint
```

## Configuration

The Super User gate reads its passphrase at build time from
`VITE_ADMIN_PASSPHRASE`. Copy `.env.example` to `.env` and set a real value
(matched case-insensitively). If it is empty, the gate stays locked. Never
commit the real value.

## Docker

```bash
cp .env.example .env      # set VITE_ADMIN_PASSPHRASE first
docker compose up --build
```

`docker compose` passes `VITE_ADMIN_PASSPHRASE` to the image build as a build
arg, so it is inlined into the client bundle. The compose file keeps the SQLite
database on the `mes-data` named volume and health-checks `/health`.

## Modules

1. **Dock receiving / store register** — contractor shipments, PO references, size-breakdown matrix, gate pass / challan / vehicle fields, and a delivery-overage guard.
2. **Five-stage packing pipeline** — checking, ironing/brushing, pair matching, first packing, second packing, with BOM-driven material requisitions.
3. **Repair bay** — rework routed back to stage-1 re-inspection, tailor attribution, and a max-two-rework scrap rule.
4. **Final QC** — AQL 1.5 sampling, quarantine holds, and export carton manifests.
5. **Dual store hub** — glove and material stock, requisitions, and return vouchers.

## Project layout

```text
src/          API routes, services, DB schema + seed data
public/       Vanilla front-end pages and design system
vanilla/      Standalone vanilla build
test/         node:test suites
server.ts     Express + Vite entry point (port 3000)
index.html    React/Vite shell entry
Program.cs    Windows desktop launcher source (C#)
Start-Packing-System.bat
Dockerfile
docker-compose.yml
```
