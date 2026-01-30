# EdoConnect Mobile

React Native mobile application for the EdoConnect platform.

## Tech Stack

- **Framework**: React Native 0.73
- **Language**: TypeScript 5
- **Navigation**: React Navigation v6
- **State Management**: Redux Toolkit + React Query
- **Forms**: React Hook Form + Zod
- **Testing**: Jest + React Native Testing Library

## Project Structure

```
edoconnect-mobile/
├── src/
│   ├── components/          # React Native components
│   │   ├── common/          # Shared components
│   │   ├── layout/          # Layout components
│   │   ├── forms/           # Form components
│   │   └── ui/              # UI primitives
│   ├── screens/             # Screen components
│   │   ├── auth/            # Authentication screens
│   │   ├── home/            # Home screens
│   │   ├── profile/         # Profile screens
│   │   └── settings/        # Settings screens
│   ├── navigation/          # Navigation configuration
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
│   └── constants/           # App constants
├── android/                 # Android native code
├── ios/                     # iOS native code
├── __tests__/               # Test files
│   ├── unit/
│   └── integration/
├── index.js                 # Entry point
└── App.tsx                  # Root component
```

## Prerequisites

- Node.js v18 LTS
- npm or yarn
- Xcode (for iOS development)
- Android Studio (for Android development)
- CocoaPods (for iOS dependencies)

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd edoconnect-mobile
```

### 2. Install dependencies

```bash
npm install

# Install iOS dependencies
cd ios && pod install && cd ..
```

### 3. Environment setup

```bash
cp .env.example .env
# Edit .env with your configuration
```

### 4. Start the application

```bash
# Start Metro bundler
npm start

# Run on iOS (macOS only)
npm run ios

# Run on Android
npm run android
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Metro bundler |
| `npm run ios` | Run on iOS simulator |
| `npm run android` | Run on Android emulator |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix linting issues |
| `npm run format` | Format code with Prettier |
| `npm run test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage |
| `npm run type-check` | TypeScript type checking |
| `npm run clean` | Clean build directories |
| `npm run pod-install` | Install iOS CocoaPods |

## iOS Setup

1. Install Xcode from the App Store
2. Install Xcode Command Line Tools:
   ```bash
   xcode-select --install
   ```
3. Install CocoaPods:
   ```bash
   sudo gem install cocoapods
   ```
4. Install iOS dependencies:
   ```bash
   cd ios && pod install && cd ..
   ```

## Android Setup

1. Install Android Studio
2. Install Android SDK (API 33 or higher)
3. Configure ANDROID_HOME environment variable
4. Create an Android Virtual Device (AVD)

## Building for Production

### iOS

```bash
# Build release
cd ios
xcodebuild -workspace EdoConnectMobile.xcworkspace -scheme EdoConnectMobile -configuration Release
```

### Android

```bash
# Build release APK
cd android
./gradlew assembleRelease

# Build release AAB (for Play Store)
./gradlew bundleRelease
```

## Testing

```bash
# Unit tests
npm run test

# Coverage report
npm run test:coverage
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## License

MIT
