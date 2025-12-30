# Interview Practice App

Interactive full-stack application for practicing coding interview problems from the [`Problems/`](../Problems) collection. Built with TypeScript, Express, and React to provide a quiz-style interface with progress tracking and flashcards.

## Purpose

This app transforms the static problem collection (85+ LeetCode-style problems across 17 categories) into an interactive practice environment where you can:
- Browse problems by category and difficulty
- Answer section-based quiz questions and review correctness
- Track attempt history and identify weak areas
- Reset progress to retake problems
- Study flashcards for concept mastery

## Project Structure

```
app/
├── packages/domain/     # Shared TypeScript types (not currently used by the app)
├── packages/logging/    # Shared logging utilities for client and server
├── server/              # Express API + problem metadata + progress storage
│   ├── data/           # Problem definitions, flashcards, user data
│   └── src/            # API routes, storage providers, server logic
└── web/                # React + Vite frontend
    └── src/            # UI components, API client, routing
```

### Key Components

- **`packages/domain/`** - Shared TypeScript types available for future use. Current app types live in `server/src/types.ts` and `web/src/types.ts`.
- **`packages/logging/`** - Shared logging helpers used by the server and web API client.
- **`server/`** - Express server exposing REST APIs, loading problem metadata from `server/data`, and persisting user progress to disk via a pluggable storage provider.
- **`web/`** - Vite + React + TypeScript frontend with a custom router (`web/src/router.tsx`), React context for user state, and API integration. Stores the active user id in localStorage and syncs attempt history with the backend.

## Quick Start

### Installation

From the `app/` directory:

```bash
npm run install:all
```

This installs dependencies for the domain package, logging package, server, and web app. To install individually:

```bash
# Just the server
cd server && npm install

# Just the web app
cd web && npm install

# Just the domain package
cd packages/domain && npm install

# Just the logging package
cd packages/logging && npm install
```

### Development Mode

Run both server and client concurrently with hot-reload:

```bash
npm run dev
```

Ports:
- Server: `http://localhost:3000` (API endpoints)
- Web: `http://localhost:5173` (Vite dev server with API proxy)

Run individually:
```bash
# Server only (port 3000)
npm run dev --prefix server

# Web only (port 5173)
npm run dev --prefix web
```

For parallel clones, override ports to avoid conflicts:

- Server: `PORT=3001 npm run dev --prefix server`
- Web: `npm run dev --prefix web -- --port 5174`

### Production Build

Build both the React frontend and Express server:

```bash
npm run build
```

What this does:
1. Bundles React app -> `web/dist/`
2. Compiles TypeScript server -> `server/dist/`

### Start Production Server

```bash
npm start
```

The Express server serves both:
- API endpoints at `/api/*`
- Static React bundle from `web/dist/` at root

Access the app at `http://localhost:3000`

## Testing

```bash
# Run all tests (server + web)
npm test

# Server tests only
npm test --prefix server

# Web tests only (React Testing Library + Vitest)
npm test --prefix web
```

## Architecture Details

### API Layer
- Location: `server/src/index.ts`
- Endpoints:
  - `GET /api/problems` - List all available problems
  - `GET /api/problems/:id` - Get problem details
  - `GET /api/flashcards` - List flashcard categories
  - `GET /api/flashcards/:categoryId` - Get flashcards for a category
  - `POST /api/users` - Create a user
  - `GET /api/users/:userId/progress` - Retrieve attempt history
  - `POST /api/users/:userId/attempts` - Submit a quiz attempt
  - `POST /api/users/:userId/reset` - Reset progress
  - `GET /api/users/:userId/flashcards/:categoryId` - Get starred flashcards
  - `POST /api/users/:userId/flashcards/:categoryId/star` - Star or unstar a flashcard
- Storage: File-based persistence in `server/data/` using a pluggable storage provider interface
- Validation: Handled in route handlers with types defined in `server/src/types.ts`

### Frontend
- Framework: React 18 + TypeScript
- Build Tool: Vite (fast HMR, optimized production builds)
- Routing: Custom router in `web/src/router.tsx`
- State Management: React hooks + context for user state and progress
- API Client: Fetch-based wrapper in `web/src/api.ts`
- Styling: Global CSS with theme variables and a light/dark toggle
- Testing: Vitest + React Testing Library

### Shared Domain
- Location: `packages/domain/src/index.ts`
- Exports: Shared types for problems and attempts (not currently wired into the app)
- Purpose: Optional single source of truth for API contracts if adopted later

## Development Workflow

1. Add new problems: Update `server/data/problems.json` and create corresponding problem JSON files in `server/data/problems/`
2. Extend API: Add routes in `server/src/index.ts`, update types in `server/src/types.ts` and `web/src/types.ts` (optionally update `packages/domain/src/`)
3. Update UI: Modify React components in `web/src/`, consume new API endpoints
4. Test: Write unit tests in `*.test.ts(x)` files, run `npm test`
5. Deploy: Build with `npm run build`, deploy `server/dist/` and `web/dist/` to hosting platform

## Environment Variables

### Server
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - `development` or `production`
- `HI_CODE_LOG_LEVEL` (or `LOG_LEVEL`) - Logging level (`silent|error|warn|info|debug|trace`)

### Web
- `VITE_LOG_LEVEL` - Logging level for the web API client

## Future Enhancements

- [ ] Expand content generation from `../Problems/` for more categories and problem data
- [ ] Timer functionality for timed quiz mode
- [ ] Difficulty-based filtering and recommendations
- [ ] Progress analytics and performance trends
- [ ] Multi-user support with authentication
- [ ] Export progress to CSV/JSON
- [ ] Mobile app using React Native (shared domain types already in place)
