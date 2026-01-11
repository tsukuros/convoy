# Convoy - Real-Time Military Logistics Tracking System

Production-ready, scalable web platform for tracking military/humanitarian supply convoys in real-time with route optimization, geofencing, and threat zone visualization.

## Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5+
- **State**: Zustand 4+
- **Mapping**: MapLibre GL JS 4+
- **Real-time**: Socket.io-client 4+
- **UI**: Radix UI + Tailwind CSS
- **Testing**: Vitest, React Testing Library, Playwright

### Backend
- **Framework**: NestJS 10+
- **Language**: TypeScript 5+
- **Database**: PostgreSQL 16+ with PostGIS
- **ORM**: Prisma 5+
- **WebSockets**: Socket.io
- **Cache**: Redis
- **Testing**: Jest, Supertest

### DevOps
- **Monorepo**: Turborepo
- **Code Quality**: Biome (linting + formatting)
- **Git Hooks**: husky + lint-staged
- **Containers**: Docker Compose

## Prerequisites

- Node.js 20+
- bun 9+
- Docker & Docker Compose

## Quick Start

1. **Clone and install dependencies**
   ```bash
   cp .env.example .env
   bun install
   ```

2. **Start infrastructure**
   ```bash
   docker-compose up -d
   ```

3. **Run database migrations**
   ```bash
   cd apps/backend
   bun prisma migrate dev
   bun prisma db seed
   ```

4. **Start development servers**
   ```bash
   bun dev
   ```

   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001
   - API Docs: http://localhost:3001/api

## Demo Credentials

- **Operator**: `operator@convoy.demo` / `demo123`
- **Admin**: `admin@convoy.demo` / `demo123`
- **Viewer**: `viewer@convoy.demo` / `demo123`

## Project Structure

```
convoy/
├── apps/
│   ├── frontend/          # Next.js application
│   └── backend/           # NestJS application
├── packages/
│   └── shared/            # Shared TypeScript types
├── docker-compose.yml
├── turbo.json
└── package.json
```

## Development

```bash
# Run all apps in dev mode
bun dev

# Build all apps
bun build

# Run tests
bun test

# Lint and format
bun check:fix
```

## License

MIT
