# HI Code App Scaffold

This `app` directory contains the foundational architecture for a new full stack TypeScript application. It separates shared domain models from the Node server and the React web frontend so each part can evolve independently while reusing core types.

## Folder layout
- `packages/domain/` – Shared TypeScript domain types that can be consumed by Node, web, and future React Native clients.
- `server/` – Minimal Node + TypeScript server scaffold with room for future API routes and data sources.
- `web/` – Vite + React + TypeScript frontend scaffold ready for upcoming quiz flows and UI screens.

## Reuse across platforms
The domain package exports pure TypeScript types with no platform-specific dependencies. This makes it safe to import in the Node server, the React web app, and a future React Native app without branching logic.

## Running projects in isolation
Each project manages its own tooling and scripts inside its folder.

### Server
```bash
cd app/server
npm install
npm run dev
```

### Web
```bash
cd app/web
npm install
npm run dev
```

Both projects run independently, keeping backend and frontend workflows decoupled while sharing the domain models from `packages/domain`.
