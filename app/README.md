# HI Code Interview Practice App

Interactive full-stack application for practicing coding interview problems from the [`Problems/`](../Problems) collection. Built with TypeScript, Express, and React to provide a quiz-style interface with progress tracking.

## Purpose

This app transforms the static problem collection (85+ LeetCode-style problems across 17 categories) into an interactive practice environment where you can:
- Browse problems by category and difficulty
- Take timed quizzes to simulate interview conditions
- Track your attempt history and identify weak areas
- Reset progress to retake problems
- Review detailed explanations and solutions

## Project Structure

```
app/
├── packages/domain/     # Shared TypeScript types for API contracts
├── server/              # Express API + problem metadata + progress storage
│   ├── data/           # Problem definitions and quiz configurations
│   └── src/            # API routes, storage providers, server logic
└── web/                # React + Vite frontend
    └── src/            # UI components, API client, routing
```

### Key Components

- **`packages/domain/`** – Shared TypeScript domain types consumed by both server and web, ensuring type safety across the stack. Can be extended for future React Native clients.
- **`server/`** – Express server exposing RESTful quiz APIs, loading problem metadata from `server/data/problems.json`, and persisting user progress to disk via pluggable storage providers.
- **`web/`** – Vite + React + TypeScript frontend with routing (React Router), state management, and API integration. Stores active user in localStorage and syncs attempt history with backend.

## Quick Start

### Installation

From the `app/` directory:

```bash
npm run install:all
```

This installs dependencies for all three packages (domain, server, web). To install individually:

```bash
# Just the server
cd server && npm install

# Just the web app
cd web && npm install

# Just the domain package
cd packages/domain && npm install
```

### Development Mode

Run both server and client concurrently with hot-reload:

```bash
npm run dev
```

**Ports:**
- Server: `http://localhost:3000` (API endpoints)
- Web: `http://localhost:5173` (Vite dev server with API proxy)

**Run individually:**
```bash
# Server only (port 3000)
npm run dev --prefix server

# Web only (port 5173)
npm run dev --prefix web
```

### Production Build

Build both the React frontend and Express server:

```bash
npm run build
```

**What this does:**
1. Bundles React app → `web/dist/`
2. Compiles TypeScript server → `server/dist/`

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
- **Location**: `server/src/index.ts`
- **Endpoints**:
  - `GET /api/problems` – List all available problems
  - `GET /api/problems/:id` – Get problem details
  - `POST /api/users/:userId/attempts` – Submit quiz attempt
  - `GET /api/users/:userId/progress` – Retrieve attempt history
  - `DELETE /api/users/:userId/progress` – Reset progress
- **Storage**: File-based persistence in `server/data/` using a pluggable storage provider interface
- **Validation**: Request/response validation using shared domain types

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite (fast HMR, optimized production builds)
- **Routing**: React Router for navigation between problem list, quiz view, and results
- **State Management**: React hooks + context for user state and progress
- **API Client**: Fetch-based wrapper in `web/src/api.ts`
- **Styling**: CSS modules + theme system (light/dark mode toggle)
- **Testing**: Vitest + React Testing Library

### Shared Domain
- **Location**: `packages/domain/src/index.ts`
- **Exports**: Problem, QuizAttempt, User, ApiResponse types
- **Purpose**: Single source of truth for API contracts, prevents type drift between frontend and backend

## Development Workflow

1. **Add new problems**: Update `server/data/problems.json` and create corresponding problem JSON files in `server/data/problems/`
2. **Extend API**: Add routes in `server/src/index.ts`, update domain types in `packages/domain/src/`
3. **Update UI**: Modify React components in `web/src/`, consume new API endpoints
4. **Test**: Write unit tests in `*.test.ts(x)` files, run `npm test`
5. **Deploy**: Build with `npm run build`, deploy `server/dist/` and `web/dist/` to hosting platform

## Environment Variables

### Server
- `PORT` – Server port (default: 3000)
- `NODE_ENV` – `development` or `production`
- `DATA_DIR` – Path to problem data directory

### Web
- `VITE_API_URL` – API base URL (default: proxies to `http://localhost:3000` in dev)

## Future Enhancements

- [ ] Integration with main problem markdown files in `../Problems/`
- [ ] Timer functionality for timed quiz mode
- [ ] Difficulty-based filtering and recommendations
- [ ] Progress analytics and performance trends
- [ ] Multi-user support with authentication
- [ ] Export progress to CSV/JSON
- [ ] Mobile app using React Native (shared domain types already in place)
