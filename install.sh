#!/bin/bash
#
# OneShot Installation Script
# Interactive setup for voice-first CID platform
#

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Repository
REPO_URL="https://github.com/CyberTechArmor/OneShot.git"

# Logging
log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Header
echo ""
echo -e "${BLUE}╔═══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                               ║${NC}"
echo -e "${BLUE}║   ${GREEN}OneShot${BLUE} - Voice-First CID Platform                        ║${NC}"
echo -e "${BLUE}║   Collaborative Intelligence Development                      ║${NC}"
echo -e "${BLUE}║                                                               ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check prerequisites
log_info "Checking prerequisites..."

if ! command -v docker &> /dev/null; then
    log_error "Docker is required but not installed."
    log_info "Install Docker: https://docs.docker.com/get-docker/"
    exit 1
fi

if ! command -v docker compose &> /dev/null; then
    log_error "Docker Compose is required but not installed."
    exit 1
fi

if ! command -v git &> /dev/null; then
    log_error "Git is required but not installed."
    exit 1
fi

log_success "Prerequisites satisfied"
echo ""

# Clone repository if not already in it
if [ ! -f "package.json" ] || ! grep -q '"name": "oneshot"' package.json 2>/dev/null; then
    log_info "Cloning OneShot repository..."
    read -p "Installation directory [oneshot]: " INSTALL_DIR
    INSTALL_DIR=${INSTALL_DIR:-oneshot}

    if [ -d "$INSTALL_DIR" ]; then
        log_error "Directory '$INSTALL_DIR' already exists."
        exit 1
    fi

    git clone "$REPO_URL" "$INSTALL_DIR"
    cd "$INSTALL_DIR"
    log_success "Repository cloned to $INSTALL_DIR"
else
    log_info "Running from existing OneShot directory"
fi
echo ""

# Create .env if not exists
if [ ! -f .env ]; then
    cp .env.example .env
    log_info "Created .env from template"
fi

# Generate JWT secret if not set
if grep -q "CHANGE_ME_IN_PRODUCTION" .env 2>/dev/null; then
    JWT_SECRET=$(openssl rand -base64 32 | tr -d '\n')
    sed -i.bak "s/JWT_SECRET=.*/JWT_SECRET=$JWT_SECRET/" .env
    rm -f .env.bak
    log_success "Generated secure JWT secret"
fi

# Interactive configuration
echo ""
log_info "Configure OneShot"
echo ""

# Port
read -p "API Port [5090]: " PORT
PORT=${PORT:-5090}
sed -i.bak "s/PORT=.*/PORT=$PORT/" .env && rm -f .env.bak

# Admin Email
echo ""
log_info "Admin Configuration"
echo "The first user to register becomes super_admin."
echo ""
read -p "Admin Email Address: " ADMIN_EMAIL
while [ -z "$ADMIN_EMAIL" ]; do
    log_warn "Email address is required"
    read -p "Admin Email Address: " ADMIN_EMAIL
done
sed -i.bak "s/ADMIN_EMAIL=.*/ADMIN_EMAIL=$ADMIN_EMAIL/" .env && rm -f .env.bak
log_success "Admin email: $ADMIN_EMAIL"
echo ""

# Reverse proxy
read -p "Enable reverse proxy? (y/n) [n]: " PROXY_ENABLED
PROXY_ENABLED=${PROXY_ENABLED:-n}
if [[ "$PROXY_ENABLED" =~ ^[Yy]$ ]]; then
    sed -i.bak "s/PROXY_ENABLED=.*/PROXY_ENABLED=true/" .env && rm -f .env.bak
    read -p "Domain (e.g., oneshot.example.com): " DOMAIN
    if [ -n "$DOMAIN" ]; then
        sed -i.bak "s/PROXY_DOMAIN=.*/PROXY_DOMAIN=$DOMAIN/" .env && rm -f .env.bak
    fi
else
    sed -i.bak "s/PROXY_ENABLED=.*/PROXY_ENABLED=false/" .env && rm -f .env.bak
fi

echo ""

# AI Configuration
log_info "AI Vendor Configuration"
echo "At least one AI vendor is required."
echo ""

read -p "Anthropic API Key (recommended): " ANTHROPIC_KEY
if [ -n "$ANTHROPIC_KEY" ]; then
    sed -i.bak "s/ANTHROPIC_API_KEY=.*/ANTHROPIC_API_KEY=$ANTHROPIC_KEY/" .env && rm -f .env.bak
    log_success "Anthropic configured"
fi

read -p "OpenAI API Key (optional): " OPENAI_KEY
if [ -n "$OPENAI_KEY" ]; then
    sed -i.bak "s/OPENAI_API_KEY=.*/OPENAI_API_KEY=$OPENAI_KEY/" .env && rm -f .env.bak
    log_success "OpenAI configured"
fi

echo ""

# Voice Configuration
log_info "Voice Configuration (ElevenLabs)"
echo "Voice is the core differentiator of OneShot."
echo ""

read -p "ElevenLabs API Key: " ELEVENLABS_KEY
if [ -n "$ELEVENLABS_KEY" ]; then
    sed -i.bak "s/ELEVENLABS_API_KEY=.*/ELEVENLABS_API_KEY=$ELEVENLABS_KEY/" .env && rm -f .env.bak
    read -p "ElevenLabs Voice ID: " ELEVENLABS_VOICE
    if [ -n "$ELEVENLABS_VOICE" ]; then
        sed -i.bak "s/ELEVENLABS_VOICE_ID=.*/ELEVENLABS_VOICE_ID=$ELEVENLABS_VOICE/" .env && rm -f .env.bak
    fi
    log_success "ElevenLabs configured"
else
    log_warn "Voice features will be disabled without ElevenLabs"
fi

echo ""

# SMTP Configuration
log_info "SMTP Configuration (Magic Links)"
echo "Required for passwordless authentication."
echo ""

read -p "Configure SMTP? (y/n) [n]: " CONFIGURE_SMTP
if [[ "$CONFIGURE_SMTP" =~ ^[Yy]$ ]]; then
    read -p "SMTP Host: " SMTP_HOST
    read -p "SMTP Port [587]: " SMTP_PORT
    SMTP_PORT=${SMTP_PORT:-587}
    read -p "SMTP User: " SMTP_USER
    read -sp "SMTP Password: " SMTP_PASSWORD
    echo ""
    read -p "From Email: " SMTP_FROM
    
    sed -i.bak "s/SMTP_HOST=.*/SMTP_HOST=$SMTP_HOST/" .env && rm -f .env.bak
    sed -i.bak "s/SMTP_PORT=.*/SMTP_PORT=$SMTP_PORT/" .env && rm -f .env.bak
    sed -i.bak "s/SMTP_USER=.*/SMTP_USER=$SMTP_USER/" .env && rm -f .env.bak
    sed -i.bak "s/SMTP_PASSWORD=.*/SMTP_PASSWORD=$SMTP_PASSWORD/" .env && rm -f .env.bak
    sed -i.bak "s/SMTP_FROM=.*/SMTP_FROM=$SMTP_FROM/" .env && rm -f .env.bak
    log_success "SMTP configured"
else
    log_warn "Magic links will not work without SMTP"
fi

echo ""

# Build and start
log_info "Starting OneShot..."
echo ""

# Create uploads directory
mkdir -p uploads

# Start services
if [[ "$PROXY_ENABLED" =~ ^[Yy]$ ]]; then
    docker compose --profile proxy up -d
else
    docker compose up -d
fi

# Wait for database
log_info "Waiting for database..."
sleep 5

# Run migrations
log_info "Running database migrations..."
docker compose exec -T api npx drizzle-kit migrate 2>/dev/null || {
    log_warn "Migrations may need to be run manually"
}

echo ""
echo -e "${GREEN}╔═══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                               ║${NC}"
echo -e "${GREEN}║   OneShot is ready!                                           ║${NC}"
echo -e "${GREEN}║                                                               ║${NC}"
if [[ "$PROXY_ENABLED" =~ ^[Yy]$ ]] && [ -n "$DOMAIN" ]; then
echo -e "${GREEN}║   Access: https://$DOMAIN                          ${NC}"
else
echo -e "${GREEN}║   Access: http://localhost:$PORT                              ${NC}"
fi
echo -e "${GREEN}║                                                               ║${NC}"
echo -e "${GREEN}║   The first user to register becomes super_admin.            ║${NC}"
echo -e "${GREEN}║                                                               ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo "Commands:"
echo "  docker compose logs -f    # View logs"
echo "  docker compose down       # Stop services"
echo "  docker compose restart    # Restart services"
echo ""
