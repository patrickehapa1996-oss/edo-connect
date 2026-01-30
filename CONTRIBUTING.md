# Contributing to EdoConnect

This document outlines our Git workflow, branching strategy, and contribution guidelines.

## Git Branching Strategy

We follow a modified GitFlow branching model optimized for continuous delivery.

```
main (production)
  │
  └── develop (integration)
        │
        ├── feature/* (new features)
        ├── bugfix/* (bug fixes)
        ├── hotfix/* (urgent production fixes)
        └── release/* (release preparation)
```

### Branch Types

| Branch | Purpose | Base Branch | Merges Into |
|--------|---------|-------------|-------------|
| `main` | Production-ready code | - | - |
| `develop` | Integration branch | `main` | `main` |
| `feature/*` | New features | `develop` | `develop` |
| `bugfix/*` | Bug fixes | `develop` | `develop` |
| `hotfix/*` | Urgent production fixes | `main` | `main` & `develop` |
| `release/*` | Release preparation | `develop` | `main` & `develop` |

### Branch Naming Conventions

```bash
# Features
feature/user-authentication
feature/payment-integration
feature/EDO-123-add-dashboard

# Bug fixes
bugfix/login-validation
bugfix/EDO-456-fix-memory-leak

# Hotfixes (urgent production issues)
hotfix/security-patch
hotfix/EDO-789-critical-fix

# Releases
release/v1.0.0
release/v1.1.0
```

## Git Workflow

### Starting a New Feature

```bash
# Ensure develop is up to date
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/my-new-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature description"

# Push to remote
git push -u origin feature/my-new-feature

# Create Pull Request to develop branch
```

### Fixing a Bug

```bash
# Start from develop
git checkout develop
git pull origin develop

# Create bugfix branch
git checkout -b bugfix/fix-description

# Fix the bug and commit
git add .
git commit -m "fix: resolve issue with X"

# Push and create PR
git push -u origin bugfix/fix-description
```

### Creating a Hotfix

```bash
# Start from main (production)
git checkout main
git pull origin main

# Create hotfix branch
git checkout -b hotfix/critical-fix

# Apply fix and commit
git add .
git commit -m "hotfix: resolve critical issue"

# Push and create PR to main
git push -u origin hotfix/critical-fix

# After merging to main, also merge to develop
git checkout develop
git merge hotfix/critical-fix
git push origin develop
```

### Preparing a Release

```bash
# Start from develop
git checkout develop
git pull origin develop

# Create release branch
git checkout -b release/v1.0.0

# Update version numbers, changelog, etc.
git commit -m "chore: prepare release v1.0.0"

# Push and create PR to main
git push -u origin release/v1.0.0

# After merging to main, tag the release
git checkout main
git pull origin main
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0

# Merge back to develop
git checkout develop
git merge release/v1.0.0
git push origin develop
```

## Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Format

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation changes |
| `style` | Code style changes (formatting, semicolons, etc.) |
| `refactor` | Code refactoring (no feature or fix) |
| `perf` | Performance improvements |
| `test` | Adding or updating tests |
| `chore` | Maintenance tasks |
| `ci` | CI/CD changes |
| `build` | Build system changes |

### Scopes

| Scope | Description |
|-------|-------------|
| `backend` | Backend API changes |
| `web` | Web frontend changes |
| `mobile` | Mobile app changes |
| `docker` | Docker configuration |
| `deps` | Dependency updates |

### Examples

```bash
# Feature
feat(backend): add user authentication endpoint

# Bug fix
fix(web): resolve login form validation error

# Documentation
docs: update README with setup instructions

# Refactoring
refactor(mobile): simplify navigation structure

# Multiple scopes
feat(backend,web): implement real-time notifications
```

## Pull Request Guidelines

### Before Creating a PR

1. Ensure your branch is up to date with the base branch
2. Run linting: `npm run lint`
3. Run tests: `npm run test`
4. Run formatting: `npm run format`

### PR Title Format

Follow the same convention as commit messages:

```
feat(backend): add user authentication
fix(web): resolve dashboard loading issue
```

### PR Description Template

```markdown
## Description
Brief description of the changes

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] E2E tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings
```

## Code Review Process

1. At least one approval required
2. All CI checks must pass
3. No merge conflicts
4. Branch must be up to date with base

## Protected Branches

### `main` Branch

- Requires pull request
- Requires 1 approval
- Requires status checks to pass
- No direct pushes
- No force pushes

### `develop` Branch

- Requires pull request
- Requires status checks to pass
- No force pushes

## Quick Reference Commands

```bash
# View all branches
git branch -a

# Delete local branch
git branch -d feature/old-feature

# Delete remote branch
git push origin --delete feature/old-feature

# Sync with remote
git fetch --prune

# Interactive rebase (clean up commits)
git rebase -i HEAD~3

# Stash changes
git stash
git stash pop

# View commit history
git log --oneline --graph --decorate

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Amend last commit
git commit --amend -m "new message"
```
