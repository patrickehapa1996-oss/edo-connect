# EdoConnect Backend

NestJS-based REST API for the EdoConnect platform.

## Tech Stack

- **Framework**: NestJS 10
- **Language**: TypeScript 5
- **Database**: PostgreSQL 14 with TypeORM
- **Cache**: Redis 7
- **Authentication**: JWT with Passport
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest

## Project Structure

```
edoconnect-backend/
├── src/
│   ├── modules/           # Feature modules
│   │   ├── auth/          # Authentication module
│   │   ├── users/         # Users module
│   │   └── health/        # Health check module
│   ├── common/            # Shared components
│   │   ├── decorators/    # Custom decorators
│   │   ├── filters/       # Exception filters
│   │   ├── guards/        # Auth guards
│   │   ├── interceptors/  # Request/response interceptors
│   │   ├── pipes/         # Validation pipes
│   │   ├── interfaces/    # TypeScript interfaces
│   │   └── constants/     # App constants
│   ├── config/            # Configuration files
│   ├── database/          # Database related
│   │   ├── entities/      # TypeORM entities
│   │   ├── migrations/    # Database migrations
│   │   └── seeders/       # Data seeders
│   ├── shared/            # Shared utilities
│   │   ├── dto/           # Common DTOs
│   │   └── utils/         # Utility functions
│   ├── app.module.ts      # Root module
│   └── main.ts            # Application entry point
├── test/                  # Test files
│   ├── unit/              # Unit tests
│   ├── e2e/               # End-to-end tests
│   └── fixtures/          # Test fixtures
├── docs/                  # Documentation
└── uploads/               # File uploads directory
```

## Prerequisites

- Node.js v18 LTS
- PostgreSQL 14
- Redis 7
- npm or yarn

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd edoconnect-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment setup

```bash
cp .env.example .env
# Edit .env with your configuration
```

### 4. Database setup

```bash
# Create database
createdb edoconnect_dev

# Run migrations
npm run migration:run

# (Optional) Seed database
npm run seed
```

### 5. Start the application

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run start:dev` | Start in development mode with hot reload |
| `npm run start:debug` | Start in debug mode |
| `npm run start:prod` | Start in production mode |
| `npm run build` | Build the application |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm run test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:cov` | Run tests with coverage |
| `npm run test:e2e` | Run end-to-end tests |
| `npm run migration:generate` | Generate a new migration |
| `npm run migration:run` | Run pending migrations |
| `npm run migration:revert` | Revert last migration |

## API Documentation

When running in development mode, Swagger documentation is available at:

```
http://localhost:3000/api/docs
```

## Environment Variables

See `.env.example` for all available environment variables.

### Required Variables

| Variable | Description |
|----------|-------------|
| `DB_HOST` | PostgreSQL host |
| `DB_PORT` | PostgreSQL port |
| `DB_USERNAME` | Database username |
| `DB_PASSWORD` | Database password |
| `DB_DATABASE` | Database name |
| `JWT_SECRET` | JWT signing secret |
| `REDIS_HOST` | Redis host |

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Docker

```bash
# Build image
docker build -t edoconnect-backend .

# Run container
docker run -p 3000:3000 --env-file .env edoconnect-backend
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## License

MIT
