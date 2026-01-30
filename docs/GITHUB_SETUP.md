# GitHub Repository Setup Guide

This guide walks through setting up the EdoConnect GitHub repository with proper configuration, branch protection, and CI/CD.

## Table of Contents

1. [Create GitHub Repository](#1-create-github-repository)
2. [Initial Repository Setup](#2-initial-repository-setup)
3. [Branch Protection Rules](#3-branch-protection-rules)
4. [GitHub Actions Setup](#4-github-actions-setup)
5. [Repository Settings](#5-repository-settings)
6. [Team Access](#6-team-access)

---

## 1. Create GitHub Repository

### Using GitHub CLI

```bash
# Login to GitHub
gh auth login

# Create private repository
gh repo create edoconnect --private --description "EdoConnect - Connecting communities through technology"

# Or create under an organization
gh repo create your-org/edoconnect --private --description "EdoConnect Platform"
```

### Using GitHub Web Interface

1. Go to https://github.com/new
2. Enter repository name: `edoconnect`
3. Select: **Private**
4. Do NOT initialize with README (we have existing code)
5. Click **Create repository**

---

## 2. Initial Repository Setup

### Connect Local Repository to GitHub

```bash
# Navigate to project directory
cd edo-connect

# Add GitHub remote (replace with your repo URL)
git remote add origin git@github.com:your-username/edoconnect.git

# Verify remote
git remote -v

# Push existing code to main branch
git branch -M main
git push -u origin main

# Create and push develop branch
git checkout -b develop
git push -u origin develop

# Return to main
git checkout main
```

### Set Default Branch

```bash
# Using GitHub CLI
gh repo edit --default-branch main

# Or via GitHub web:
# Settings → Branches → Default branch → Change to "main"
```

---

## 3. Branch Protection Rules

### Protect `main` Branch

**Via GitHub CLI:**

```bash
gh api repos/{owner}/{repo}/branches/main/protection -X PUT -f required_status_checks='{"strict":true,"contexts":["ci"]}' -f enforce_admins=true -f required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true}' -f restrictions=null
```

**Via GitHub Web Interface:**

1. Go to **Settings** → **Branches**
2. Click **Add rule**
3. Branch name pattern: `main`
4. Enable:
   - ✅ Require a pull request before merging
     - ✅ Require approvals (1)
     - ✅ Dismiss stale pull request approvals
   - ✅ Require status checks to pass before merging
     - ✅ Require branches to be up to date
     - Select checks: `ci`, `lint`, `test`
   - ✅ Require conversation resolution before merging
   - ✅ Do not allow bypassing the above settings
   - ❌ Allow force pushes (disabled)
   - ❌ Allow deletions (disabled)
5. Click **Create**

### Protect `develop` Branch

1. Go to **Settings** → **Branches**
2. Click **Add rule**
3. Branch name pattern: `develop`
4. Enable:
   - ✅ Require a pull request before merging
   - ✅ Require status checks to pass before merging
   - ❌ Allow force pushes (disabled)
5. Click **Create**

---

## 4. GitHub Actions Setup

GitHub Actions workflows are already configured in `.github/workflows/`. They include:

### CI Pipeline (`ci.yml`)

- Runs on every push and pull request
- Lints code
- Runs tests
- Type checking
- Build verification

### Deployment Pipeline (`deploy.yml`)

- Triggered on merge to main
- Builds Docker images
- Deploys to staging/production

### Required Secrets

Add these secrets in **Settings** → **Secrets and variables** → **Actions**:

| Secret | Description |
|--------|-------------|
| `DOCKER_USERNAME` | Docker Hub username |
| `DOCKER_PASSWORD` | Docker Hub password/token |
| `AWS_ACCESS_KEY_ID` | AWS access key (if deploying to AWS) |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key |
| `DATABASE_URL` | Production database URL |
| `JWT_SECRET` | Production JWT secret |

```bash
# Add secrets via CLI
gh secret set DOCKER_USERNAME --body "your-username"
gh secret set DOCKER_PASSWORD --body "your-token"
```

---

## 5. Repository Settings

### General Settings

1. **Settings** → **General**
   - ✅ Wikis (disable if not needed)
   - ✅ Issues
   - ✅ Projects
   - ✅ Preserve this repository
   - ❌ Allow forking (for private repos)

### Merge Settings

1. **Settings** → **General** → **Pull Requests**
   - ✅ Allow merge commits
   - ✅ Allow squash merging (recommended)
   - ❌ Allow rebase merging
   - ✅ Always suggest updating pull request branches
   - ✅ Automatically delete head branches

### Security Settings

1. **Settings** → **Security** → **Code security and analysis**
   - ✅ Dependency graph
   - ✅ Dependabot alerts
   - ✅ Dependabot security updates
   - ✅ Secret scanning

---

## 6. Team Access

### Add Collaborators

```bash
# Add individual collaborator
gh api repos/{owner}/{repo}/collaborators/{username} -X PUT -f permission=push

# Permissions: pull, push, admin, maintain, triage
```

### Create Teams (Organizations)

1. Go to **Organization** → **Teams**
2. Create teams:
   - `edoconnect-admins` (Admin access)
   - `edoconnect-developers` (Write access)
   - `edoconnect-reviewers` (Triage access)

### Add Team to Repository

```bash
gh api orgs/{org}/teams/{team_slug}/repos/{owner}/{repo} -X PUT -f permission=push
```

---

## Quick Setup Script

Run this script after creating the GitHub repository:

```bash
#!/bin/bash

# Variables - UPDATE THESE
GITHUB_USER="your-username"
REPO_NAME="edoconnect"
REPO_URL="git@github.com:${GITHUB_USER}/${REPO_NAME}.git"

echo "🚀 Setting up EdoConnect GitHub repository..."

# Add remote
git remote add origin $REPO_URL 2>/dev/null || git remote set-url origin $REPO_URL

# Ensure we're on main
git checkout main 2>/dev/null || git checkout -b main

# Push main branch
echo "📤 Pushing main branch..."
git push -u origin main

# Create and push develop branch
echo "🌿 Creating develop branch..."
git checkout -b develop 2>/dev/null || git checkout develop
git push -u origin develop

# Return to main
git checkout main

# Set up branch protection (requires gh CLI)
echo "🔒 Setting up branch protection..."

# Protect main
gh api repos/${GITHUB_USER}/${REPO_NAME}/branches/main/protection -X PUT \
  -H "Accept: application/vnd.github+json" \
  -f required_status_checks='{"strict":true,"contexts":[]}' \
  -f enforce_admins=false \
  -f required_pull_request_reviews='{"required_approving_review_count":1}' \
  -f restrictions=null \
  -f allow_force_pushes=false \
  -f allow_deletions=false

echo "✅ GitHub repository setup complete!"
echo ""
echo "Repository URL: https://github.com/${GITHUB_USER}/${REPO_NAME}"
echo ""
echo "Next steps:"
echo "1. Configure GitHub Actions secrets"
echo "2. Set up deployment environments"
echo "3. Invite team members"
```

---

## Verification Checklist

After setup, verify:

- [ ] Repository is private
- [ ] Main branch is protected
- [ ] Develop branch exists and is protected
- [ ] GitHub Actions workflows are visible
- [ ] Branch protection shows required checks
- [ ] Team members have appropriate access
- [ ] Dependabot alerts are enabled
- [ ] Secret scanning is enabled

---

## Troubleshooting

### Push Rejected

```bash
# If push to protected branch is rejected
git checkout -b feature/my-changes
git push -u origin feature/my-changes
# Create PR via GitHub
```

### Permission Denied

```bash
# Check SSH key
ssh -T git@github.com

# Or use HTTPS with token
git remote set-url origin https://github.com/username/repo.git
```

### Branch Protection API Error

```bash
# Ensure you have admin access
gh api repos/{owner}/{repo} --jq '.permissions'
```
