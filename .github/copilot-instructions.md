# Repository overview
- Interview prep repo with a full-stack app in `app/` (React + Vite frontend, Express + TypeScript backend) plus study notes in `Problems/` and reference solutions in `Solutions/`.
- Primary runtime: Node.js `20.12.2` (see `.nvmrc`). TypeScript is used in `app/server` and `app/web`.

# Project layout
- `app/` is the runnable application.
  - `app/web/`: React + Vite UI. Entry: `app/web/src/main.tsx`, routes in `app/web/src/App.tsx`.
  - `app/server/`: Express API + file-backed storage. Entry: `app/server/src/index.ts`. Data lives in `app/server/data`.
  - `app/packages/`: small shared packages (e.g., `app/packages/logging`).
  - `app/package.json`: root scripts for dev/build/test/lint/format/precommit.
- `Problems/`: markdown study guides that feed content generation scripts.
- `scripts/generate-flashcards.js`: one-off generator to build JSON flashcard data under `app/server/data/flashcards`.
- No GitHub Actions workflows are present.

# Bootstrap / install
- Always run installs from the `app` workspace:
  - `npm run install:all --prefix app`
  - This installs `app/packages/domain`, `app/packages/logging`, `app/server`, and `app/web`.

# Common commands (run from repo root)
- Dev (server + web, with watch): `npm run dev --prefix app`
- Dev with trace logging: `npm run dev:verbose --prefix app`
- Build: `npm run build --prefix app`
- Test (server then web, both with coverage): `npm run test --prefix app`
- Lint (TypeScript typecheck): `npm run lint --prefix app`
- Lint watch: `npm run lint:watch --prefix app`
- Format (Prettier): `npm run format --prefix app`
- Format check: `npm run format:check --prefix app`
- Precommit checks (format:check + lint + test + build): `npm run precommit --prefix app`

# Data + content generation
- File-based data is under `app/server/data`. User progress is stored in `app/server/data/users` and is ignored by git.
- Flashcards are generated once from `Problems/*.md`:
  - `npm run generate:flashcards --prefix app/server`

# Logging
- Server log level via `HI_CODE_LOG_LEVEL` (or `LOG_LEVEL`), client via `VITE_LOG_LEVEL`.
- API request/response logging is built into both server and web `api.ts`.

# Notes for agents
- Prefer updating `app/` code; markdown in `Problems/` is source data, not runtime.
- Trust these instructions; only search the repo if info is missing or incorrect.
- For parallel local clones, override ports to avoid conflicts (default `web:5173`, `server:3000`).
