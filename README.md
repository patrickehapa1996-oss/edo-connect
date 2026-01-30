# EdoConnect

Connecting communities through technology - A full-stack platform with web and mobile applications.

## Project Structure

```
edo-connect/
├── edoconnect-backend/     # NestJS REST API
├── edoconnect-web/         # React web application
├── edoconnect-mobile/      # React Native mobile app
├── docker-compose.yml      # Full stack Docker setup
├── docker-compose.dev.yml  # Development services (DB, Redis)
├── DEVELOPMENT_SETUP.md    # Development environment guide
└── package.json            # Root workspace configuration
```

## Tech Stack

| Component | Technology |
|-----------|------------|
| Backend | NestJS, TypeScript, TypeORM |
| Web | React, Vite, TypeScript, Tailwind CSS |
| Mobile | React Native, TypeScript |
| Database | PostgreSQL 14 |
| Cache | Redis 7 |
| State Management | Redux Toolkit, React Query |
| Authentication | JWT, Passport |

## Quick Start

### Prerequisites

- Node.js v18 LTS
- Docker Desktop (for local services)
- npm or yarn

See [DEVELOPMENT_SETUP.md](./DEVELOPMENT_SETUP.md) for detailed installation instructions.

### 1. Clone and Install

```bash
git clone <repository-url>
cd edo-connect

# Install all dependencies
npm run install:all
```

### 2. Start Development Services

```bash
# Start PostgreSQL and Redis via Docker
npm run docker:dev

# Or start full stack (including apps)
npm run docker:up
```

### 3. Configure Environment

```bash
# Backend
cp edoconnect-backend/.env.example edoconnect-backend/.env

# Web
cp edoconnect-web/.env.example edoconnect-web/.env

# Mobile
cp edoconnect-mobile/.env.example edoconnect-mobile/.env
```

### 4. Run Applications

```bash
# Terminal 1: Backend API
npm run backend

# Terminal 2: Web App
npm run web

# Terminal 3: Mobile App
npm run mobile:start
npm run mobile:ios   # or mobile:android
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run backend` | Start backend in dev mode |
| `npm run web` | Start web app in dev mode |
| `npm run mobile:start` | Start Metro bundler |
| `npm run mobile:ios` | Run on iOS simulator |
| `npm run mobile:android` | Run on Android emulator |
| `npm run docker:dev` | Start dev services (DB, Redis) |
| `npm run docker:up` | Start full Docker stack |
| `npm run lint` | Lint all workspaces |
| `npm run test` | Test all workspaces |

## Service URLs

| Service | URL |
|---------|-----|
| Backend API | http://localhost:3000 |
| Swagger Docs | http://localhost:3000/api/docs |
| Web App | http://localhost:5173 |
| pgAdmin | http://localhost:5050 |
| Redis Commander | http://localhost:8081 |

## Project Repositories

### Backend (`edoconnect-backend/`)

NestJS REST API with:
- JWT authentication
- PostgreSQL database with TypeORM
- Redis caching
- Swagger documentation
- Modular architecture

### Web (`edoconnect-web/`)

React SPA with:
- Vite build tool
- Tailwind CSS styling
- Redux Toolkit state management
- React Query for server state
- React Router for navigation

### Mobile (`edoconnect-mobile/`)

React Native app with:
- Cross-platform (iOS/Android)
- React Navigation
- Redux Toolkit state management
- Native styling

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## License

MIT
