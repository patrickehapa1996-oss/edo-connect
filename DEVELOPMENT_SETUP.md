# EdoConnect Development Environment Setup

This guide provides installation instructions for setting up your development environment on **macOS**, **Windows**, and **Linux**.

## Prerequisites Overview

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | v18 LTS | JavaScript runtime |
| npm/npx | (bundled) | Package management |
| PostgreSQL | 14 | Primary database |
| Redis | 7 | Caching & sessions |
| Git | Latest | Version control |
| Docker Desktop | Latest | Containerization |
| VS Code | Latest | Code editor |

---

## macOS Installation

### 1. Homebrew (Package Manager)

If you don't have Homebrew installed:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 2. Node.js v18 LTS

```bash
# Install Node.js 18 LTS
brew install node@18

# Add to PATH (add to ~/.zshrc or ~/.bash_profile)
echo 'export PATH="/opt/homebrew/opt/node@18/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Or use nvm (recommended for version management)
brew install nvm
mkdir ~/.nvm
echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.zshrc
echo '[ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && \. "/opt/homebrew/opt/nvm/nvm.sh"' >> ~/.zshrc
source ~/.zshrc
nvm install 18
nvm use 18
nvm alias default 18
```

### 3. PostgreSQL 14

```bash
# Install PostgreSQL 14
brew install postgresql@14

# Start PostgreSQL service
brew services start postgresql@14

# Add to PATH
echo 'export PATH="/opt/homebrew/opt/postgresql@14/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Create default database (optional)
createdb edo_connect_dev
```

### 4. Redis 7

```bash
# Install Redis
brew install redis

# Start Redis service
brew services start redis
```

### 5. Git

```bash
# Git comes pre-installed on macOS, but to get the latest:
brew install git

# Configure Git
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### 6. Docker Desktop

```bash
# Download and install Docker Desktop from:
# https://www.docker.com/products/docker-desktop/

# Or via Homebrew Cask
brew install --cask docker

# Launch Docker Desktop from Applications
# Wait for Docker to start (whale icon in menu bar)
```

### 7. Visual Studio Code

```bash
# Install VS Code
brew install --cask visual-studio-code

# Install extensions via CLI
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension rangav.vscode-thunder-client
```

---

## Windows Installation

### 1. Chocolatey (Package Manager)

Open PowerShell as Administrator:

```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

Restart PowerShell after installation.

### 2. Node.js v18 LTS

```powershell
# Install Node.js 18 LTS
choco install nodejs-lts --version=18.20.4 -y

# Or download directly from:
# https://nodejs.org/en/download/

# Restart terminal after installation
```

### 3. PostgreSQL 14

```powershell
# Install PostgreSQL 14
choco install postgresql14 -y

# Or download from:
# https://www.postgresql.org/download/windows/

# After installation, PostgreSQL service starts automatically
# Default superuser: postgres
# Set password during installation

# Add to PATH (if not added automatically):
# C:\Program Files\PostgreSQL\14\bin
```

### 4. Redis 7

```powershell
# Option 1: Using Chocolatey (installs Memurai, Redis-compatible for Windows)
choco install memurai-developer -y

# Option 2: Use Docker (recommended for Windows)
docker run -d --name redis -p 6379:6379 redis:7

# Option 3: Use WSL2 (Windows Subsystem for Linux)
# Install WSL2 first, then follow Linux instructions
```

### 5. Git

```powershell
# Install Git
choco install git -y

# Restart terminal, then configure
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### 6. Docker Desktop

```powershell
# Install Docker Desktop
choco install docker-desktop -y

# Or download from:
# https://www.docker.com/products/docker-desktop/

# Requirements:
# - Windows 10/11 Pro, Enterprise, or Education (for Hyper-V)
# - Or Windows 10/11 Home with WSL2 backend
# - Enable virtualization in BIOS

# After installation, restart your computer
# Launch Docker Desktop and complete setup
```

### 7. Visual Studio Code

```powershell
# Install VS Code
choco install vscode -y

# Restart terminal, then install extensions
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension rangav.vscode-thunder-client
```

---

## Linux Installation (Ubuntu/Debian)

### 1. Update System

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Node.js v18 LTS

```bash
# Install using NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Or use nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18
nvm alias default 18
```

### 3. PostgreSQL 14

```bash
# Add PostgreSQL repository
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo apt update

# Install PostgreSQL 14
sudo apt install -y postgresql-14 postgresql-contrib-14

# Start and enable service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Set password for postgres user
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'your_password';"

# Create development database
sudo -u postgres createdb edo_connect_dev
```

### 4. Redis 7

```bash
# Add Redis repository
curl -fsSL https://packages.redis.io/gpg | sudo gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] https://packages.redis.io/deb $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/redis.list
sudo apt update

# Install Redis 7
sudo apt install -y redis

# Start and enable service
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

### 5. Git

```bash
# Install Git
sudo apt install -y git

# Configure Git
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### 6. Docker Desktop

```bash
# Remove old versions
sudo apt remove docker docker-engine docker.io containerd runc

# Install dependencies
sudo apt install -y ca-certificates curl gnupg lsb-release

# Add Docker's official GPG key
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Add repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Add user to docker group (to run without sudo)
sudo usermod -aG docker $USER
newgrp docker

# For Docker Desktop GUI (optional):
# Download .deb from https://www.docker.com/products/docker-desktop/
# sudo apt install ./docker-desktop-<version>-amd64.deb
```

### 7. Visual Studio Code

```bash
# Add Microsoft repository
wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > packages.microsoft.gpg
sudo install -D -o root -g root -m 644 packages.microsoft.gpg /etc/apt/keyrings/packages.microsoft.gpg
sudo sh -c 'echo "deb [arch=amd64,arm64,armhf signed-by=/etc/apt/keyrings/packages.microsoft.gpg] https://packages.microsoft.com/repos/code stable main" > /etc/apt/sources.list.d/vscode.list'
rm -f packages.microsoft.gpg

# Install VS Code
sudo apt update
sudo apt install -y code

# Install extensions
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension rangav.vscode-thunder-client
```

---

## Verification Steps

Run these commands to verify all installations are working correctly:

### 1. Node.js, npm, and npx

```bash
node --version
# Expected: v18.x.x

npm --version
# Expected: 9.x.x or 10.x.x

npx --version
# Expected: 9.x.x or 10.x.x
```

### 2. PostgreSQL 14

```bash
# Check version
psql --version
# Expected: psql (PostgreSQL) 14.x

# Test connection (macOS/Linux)
psql -U postgres -c "SELECT version();"

# Test connection (Windows - in Command Prompt)
psql -U postgres -c "SELECT version();"

# If prompted for password, enter the password you set during installation
```

### 3. Redis 7

```bash
# Check version
redis-server --version
# Expected: Redis server v=7.x.x

# Test connection
redis-cli ping
# Expected: PONG

# Check Redis info
redis-cli INFO server | grep redis_version
# Expected: redis_version:7.x.x
```

### 4. Git

```bash
git --version
# Expected: git version 2.x.x

# Verify configuration
git config --global user.name
git config --global user.email
```

### 5. Docker

```bash
# Check Docker version
docker --version
# Expected: Docker version 24.x.x or higher

# Check Docker Compose
docker compose version
# Expected: Docker Compose version v2.x.x

# Test Docker
docker run hello-world
# Expected: "Hello from Docker!" message

# Check Docker is running
docker info
```

### 6. VS Code Extensions

```bash
# List installed extensions
code --list-extensions | grep -E "eslint|prettier|typescript|thunder"
# Expected output:
# dbaeumer.vscode-eslint
# esbenp.prettier-vscode
# ms-vscode.vscode-typescript-next
# rangav.vscode-thunder-client
```

---

## Quick Verification Script

Create and run this script to verify all tools at once:

```bash
#!/bin/bash
echo "=== EdoConnect Development Environment Verification ==="
echo ""

echo "1. Node.js:"
node --version 2>/dev/null || echo "   NOT INSTALLED"

echo "2. npm:"
npm --version 2>/dev/null || echo "   NOT INSTALLED"

echo "3. npx:"
npx --version 2>/dev/null || echo "   NOT INSTALLED"

echo "4. PostgreSQL:"
psql --version 2>/dev/null || echo "   NOT INSTALLED"

echo "5. Redis:"
redis-server --version 2>/dev/null || echo "   NOT INSTALLED"

echo "6. Git:"
git --version 2>/dev/null || echo "   NOT INSTALLED"

echo "7. Docker:"
docker --version 2>/dev/null || echo "   NOT INSTALLED"

echo "8. Docker Compose:"
docker compose version 2>/dev/null || echo "   NOT INSTALLED"

echo "9. VS Code:"
code --version 2>/dev/null | head -1 || echo "   NOT INSTALLED"

echo ""
echo "=== Service Status ==="
echo "PostgreSQL: $(pg_isready 2>/dev/null && echo 'Running' || echo 'Not running')"
echo "Redis: $(redis-cli ping 2>/dev/null || echo 'Not running')"
echo "Docker: $(docker info >/dev/null 2>&1 && echo 'Running' || echo 'Not running')"

echo ""
echo "=== VS Code Extensions ==="
code --list-extensions 2>/dev/null | grep -E "eslint|prettier|typescript|thunder" || echo "VS Code not available or no extensions found"
```

---

## Troubleshooting

### PostgreSQL Connection Issues

```bash
# macOS: Restart PostgreSQL
brew services restart postgresql@14

# Linux: Restart PostgreSQL
sudo systemctl restart postgresql

# Windows: Restart via Services app or
net stop postgresql-x64-14
net start postgresql-x64-14
```

### Redis Connection Issues

```bash
# macOS: Restart Redis
brew services restart redis

# Linux: Restart Redis
sudo systemctl restart redis-server

# Windows (Docker): Restart container
docker restart redis
```

### Docker Permission Denied (Linux)

```bash
# Add user to docker group
sudo usermod -aG docker $USER

# Apply changes (or log out and back in)
newgrp docker
```

### Node.js Version Conflicts

```bash
# Use nvm to switch versions
nvm use 18

# Set as default
nvm alias default 18
```

---

## Next Steps

After completing the setup:

1. Clone the EdoConnect repository
2. Install project dependencies: `npm install`
3. Copy environment template: `cp .env.example .env`
4. Configure your local environment variables
5. Run database migrations
6. Start the development server

---

## Support

If you encounter issues during setup, please:

1. Check the troubleshooting section above
2. Ensure all prerequisites are met for your OS
3. Open an issue in the repository with:
   - Your operating system and version
   - The specific error message
   - Steps you've already tried
