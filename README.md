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
- **Database**: PostgreSQL 17 (Neon) or 17+ with PostGIS
- **ORM**: Prisma 6+
- **Password Hashing**: Argon2
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
- bun 1.0+
- Docker & Docker Compose (optional for local database)
- Neon account (optional, for cloud database)

## Quick Start

1. **Clone and install dependencies**
   ```bash
   cp .env.example .env
   # Edit .env with your database URL (Neon or local Docker)
   bun install
   ```

2. **Start infrastructure**

   **Option A: Neon (Cloud)**
   - Create a project at https://neon.tech
   - Copy connection string to `DATABASE_URL` in `.env`
   - Skip Docker setup

   **Option B: Local Docker**
   ```bash
   docker-compose up -d
   ```

3. **Run database migrations**
   ```bash
   cd apps/backend
   bun run db:migrate  # Create tables
   bun run db:seed     # Seed demo users
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

# Type check all packages
bun tsc

# Lint and format
bun check:fix
```

### Database Management

All database commands run from `apps/backend`:

```bash
cd apps/backend

# Generate Prisma Client
bun run db:generate

# Create/update database schema
bun run db:migrate

# Seed demo users
bun run db:seed

# Open Prisma Studio (GUI)
bun run db:studio

# Push schema without migrations
bun run db:push
```

## License

MIT
