# HI Code application

Full-stack TypeScript project combining a small Express API with a Vite-powered React UI. The backend persists quiz progress to disk while the frontend provides the interactive experience.

## Folder layout
- `packages/domain/` – Shared TypeScript domain types that can be consumed by Node, web, and future React Native clients.
- `server/` – Express server that exposes quiz APIs, persists users to disk, and serves the built React app in production.
- `web/` – Vite + React + TypeScript frontend for browsing problems, attempting quizzes, and resetting progress.

## Setup
From the `app` directory:

```bash
npm run install:all
```

This installs dependencies for the domain package, server, and web app. If you only want one side, run `npm install` inside the specific folder instead.

## Development
Run the server and client together with a single command (server on port 3000, Vite on 5173 with proxying to the API):

```bash
npm run dev
```

You can still run each side individually if desired:

- Server: `npm run dev --prefix server`
- Web: `npm run dev --prefix web`

## Production build & serve
Build the React app and the server in one go:

```bash
npm run build
```

Then start the compiled server (serves the React build from `/web/dist`):

```bash
npm start
```

## Testing
- Server: `npm test --prefix server`
- Web: `npm test --prefix web`
- Combined: `npm test`

## Architecture overview
- **API layer**: Express routes live in `server/src/index.ts`. They validate inputs, load quiz metadata from `server/data`, and persist user progress via a pluggable storage provider.
- **Static hosting**: When built, the server also serves the React bundle from `web/dist` so a single Node process can deliver both API and UI.
- **Frontend**: The React UI (in `web/src`) communicates with the API via `fetch`, stores the active user in localStorage, and keeps attempt history in sync with the backend.
- **Shared model**: Domain types live in `packages/domain` to keep future clients aligned on shape without duplicating definitions.
