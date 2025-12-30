# Repository Guidelines

## Project Structure & Module Organization
- Root contains study content (`Problems/`, `Solutions/`) and the runnable app in `app/`.
- `app/web/`: React + Vite frontend (source in `app/web/src`, tests co-located with `*.test.tsx`).
- `app/server/`: Express + TypeScript backend (source in `app/server/src`, tests in `app/server/tests`).
- `app/packages/`: shared packages (e.g., `app/packages/logging`).
- Generated runtime data lives under `app/server/data` (user data in `app/server/data/users`).

## Build, Test, and Development Commands
Run from repo root:
- `npm run install:all --prefix app` installs all app packages.
- `npm run dev --prefix app` starts web + server with watch.
- `npm run dev:verbose --prefix app` enables trace logging.
- `npm run build --prefix app` builds web then server.
- `npm run test --prefix app` runs server then web tests with coverage.
- `npm run lint --prefix app` TypeScript typecheck for server and web.
- `npm run precommit --prefix app` runs format:check, lint, test, build.

## Coding Style & Naming Conventions
- TypeScript with strict mode; keep functions small and explicit.
- Indentation: 2 spaces. Prefer descriptive names (`flashcards`, `problems`).
- Formatting: Prettier is used for non-Markdown files via `npm run format`.
- Linting: `tsc --noEmit` only (no ESLint).

## Testing Guidelines
- Server: Vitest, tests in `app/server/tests`, names end in `.test.ts`.
- Web: Vitest + Testing Library, tests in `app/web/src` with `.test.tsx`.
- Coverage target is 75%+ (configured in Vitest).

## Commit & Pull Request Guidelines
- No strict commit format in history; use short, imperative summaries (e.g., “add logging”).
- PRs should describe the change, list tests run, and call out any warnings.
- Include screenshots for UI changes when practical.

## Configuration Notes
- Node version is `20.12.2` (see `.nvmrc`).
- Do not read markdown at runtime; content generation happens via scripts.

## Parallel Clone Tips
- Each clone can run independently, but dev ports conflict by default (`web:5173`, `server:3000`).
- For parallel runs, start servers manually per clone:
  - `PORT=3001 npm run dev --prefix app/server`
  - `npm run dev --prefix app/web -- --port 5174`
- Each clone has its own `app/server/data/users` directory; avoid sharing user data between clones.
