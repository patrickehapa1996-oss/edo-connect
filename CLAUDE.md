# CLAUDE.md - AI Assistant Guidelines for edo-connect

This document provides context and guidelines for AI assistants working on the edo-connect project.

## Project Overview

**Project Name**: edo-connect
**Status**: Initial Setup Phase
**Repository**: patrickehapa1996-oss/edo-connect

### Current State

This repository is in its initial setup phase. As of now, it contains only the project README. The codebase structure, dependencies, and development workflows have not yet been established.

## Repository Structure

```
edo-connect/
├── CLAUDE.md          # AI assistant guidelines (this file)
├── README.md          # Project documentation
└── .git/              # Git version control
```

> **Note**: Update this section as the project structure evolves.

## Development Guidelines

### Git Workflow

1. **Branch Naming**: Use descriptive branch names following the pattern:
   - `feature/<description>` - For new features
   - `fix/<description>` - For bug fixes
   - `refactor/<description>` - For code refactoring
   - `docs/<description>` - For documentation updates

2. **Commit Messages**: Write clear, concise commit messages:
   - Use imperative mood ("Add feature" not "Added feature")
   - First line should be under 72 characters
   - Include context in the body when necessary

3. **Pull Requests**:
   - Include a clear description of changes
   - Reference any related issues
   - Ensure all tests pass before requesting review

### Code Conventions

> **Note**: Update this section once the tech stack is established.

When the project is set up, follow these general principles:

1. **Code Quality**:
   - Write clean, readable, and maintainable code
   - Follow the principle of single responsibility
   - Keep functions small and focused
   - Use meaningful variable and function names

2. **Documentation**:
   - Document public APIs and complex logic
   - Keep comments up to date with code changes
   - Use JSDoc/TSDoc for JavaScript/TypeScript projects

3. **Error Handling**:
   - Handle errors gracefully
   - Provide meaningful error messages
   - Log errors appropriately for debugging

### Testing

> **Note**: Update this section once the testing framework is configured.

When testing is set up:
- Write unit tests for new functionality
- Maintain or improve code coverage
- Run tests before committing changes

## Commands Reference

> **Note**: Update this section once package.json and scripts are configured.

Common commands will be documented here:

```bash
# Install dependencies
# npm install

# Run development server
# npm run dev

# Build for production
# npm run build

# Run tests
# npm test

# Lint code
# npm run lint
```

## Architecture

> **Note**: Document the system architecture here as it develops.

### Key Components

_To be documented as the project develops._

### Data Flow

_To be documented as the project develops._

### External Dependencies

_To be documented as the project develops._

## Environment Setup

> **Note**: Update this section with specific setup instructions.

### Prerequisites

- Node.js (version TBD)
- npm or yarn

### Local Development

1. Clone the repository
2. Install dependencies
3. Configure environment variables
4. Start development server

## AI Assistant Best Practices

When working on this codebase:

1. **Read Before Modifying**: Always read and understand existing code before making changes.

2. **Minimal Changes**: Make focused, minimal changes that directly address the task at hand. Avoid unnecessary refactoring.

3. **Preserve Patterns**: Follow existing code patterns and conventions in the codebase.

4. **Test Changes**: Verify changes work correctly and don't break existing functionality.

5. **Security Awareness**: Be mindful of security implications:
   - Never commit secrets or credentials
   - Validate user inputs
   - Sanitize outputs
   - Follow OWASP guidelines

6. **Error Handling**: Implement proper error handling for edge cases.

7. **Documentation Updates**: Update relevant documentation when making significant changes.

## Troubleshooting

> **Note**: Document common issues and solutions as they are discovered.

## Contributing

_To be documented based on project requirements._

---

**Last Updated**: January 2026
**Maintained By**: AI Assistant (Claude)

> This document should be updated as the project evolves. When adding new features, dependencies, or changing workflows, please update the relevant sections.
