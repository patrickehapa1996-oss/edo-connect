# EdoConnect Web

React-based web application for the EdoConnect platform.

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite 5
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit + React Query
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod
- **Testing**: Vitest + Playwright

## Project Structure

```
edoconnect-web/
├── src/
│   ├── components/          # React components
│   │   ├── common/          # Shared components
│   │   ├── layout/          # Layout components
│   │   ├── forms/           # Form components
│   │   └── ui/              # UI primitives
│   ├── pages/               # Page components
│   │   ├── auth/            # Authentication pages
│   │   ├── dashboard/       # Dashboard pages
│   │   ├── profile/         # Profile pages
│   │   └── settings/        # Settings pages
│   ├── hooks/               # Custom React hooks
│   ├── services/            # API services
│   ├── store/               # Redux store
│   │   └── slices/          # Redux slices
│   ├── utils/               # Utility functions
│   ├── types/               # TypeScript types
│   ├── assets/              # Static assets
│   │   ├── images/
│   │   ├── fonts/
│   │   └── icons/
│   ├── styles/              # Global styles
│   ├── App.tsx              # Root component
│   └── main.tsx             # Entry point
├── public/                  # Public assets
├── tests/                   # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
└── index.html               # HTML template
```

## Prerequisites

- Node.js v18 LTS
- npm or yarn

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd edoconnect-web
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

### 4. Start development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix linting issues |
| `npm run format` | Format code with Prettier |
| `npm run test` | Run unit tests |
| `npm run test:ui` | Run tests with UI |
| `npm run test:coverage` | Run tests with coverage |
| `npm run test:e2e` | Run E2E tests |
| `npm run type-check` | TypeScript type checking |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API URL |
| `VITE_API_TIMEOUT` | API request timeout (ms) |
| `VITE_APP_NAME` | Application name |
| `VITE_ENABLE_DEBUG` | Enable debug mode |

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

## Building for Production

```bash
npm run build
```

Build output will be in the `dist/` directory.

## Docker

```bash
# Build image
docker build -t edoconnect-web .

# Run container
docker run -p 80:80 edoconnect-web
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## License

MIT
