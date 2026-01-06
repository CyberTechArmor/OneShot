#!/bin/bash
#
# OneShot Uninstall Script
# Removes Docker containers, volumes, network, and optionally the installation directory
#

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging
log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Header
echo ""
echo -e "${RED}╔═══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${RED}║                                                               ║${NC}"
echo -e "${RED}║   ${YELLOW}OneShot${RED} - Uninstall                                        ║${NC}"
echo -e "${RED}║   This will remove all OneShot data!                          ║${NC}"
echo -e "${RED}║                                                               ║${NC}"
echo -e "${RED}╚═══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Confirm uninstall
log_warn "This will permanently delete:"
echo "  - All Docker containers (oneshot-api, oneshot-db, oneshot-caddy)"
echo "  - All Docker volumes (postgres_data, caddy_data, caddy_config)"
echo "  - The Docker network (oneshot)"
echo "  - All uploaded files"
echo ""

read -p "Are you sure you want to continue? (yes/no) [no]: " CONFIRM
if [[ "$CONFIRM" != "yes" ]]; then
    log_info "Uninstall cancelled"
    exit 0
fi

echo ""

# Get the script's directory (in case run from elsewhere)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Stop and remove containers
log_info "Stopping containers..."
docker compose --profile proxy down 2>/dev/null || docker compose down 2>/dev/null || true
log_success "Containers stopped"

# Remove volumes
log_info "Removing Docker volumes..."
docker volume rm oneshot_postgres_data 2>/dev/null || true
docker volume rm oneshot_caddy_data 2>/dev/null || true
docker volume rm oneshot_caddy_config 2>/dev/null || true
log_success "Volumes removed"

# Remove network
log_info "Removing Docker network..."
docker network rm oneshot 2>/dev/null || true
log_success "Network removed"

# Remove uploads directory
if [ -d "uploads" ]; then
    log_info "Removing uploads directory..."
    rm -rf uploads
    log_success "Uploads removed"
fi

# Remove .env file
if [ -f ".env" ]; then
    log_info "Removing .env configuration..."
    rm -f .env
    log_success "Configuration removed"
fi

# Remove built Docker image
log_info "Removing Docker image..."
docker rmi oneshot-api 2>/dev/null || true
docker rmi $(docker images -q --filter "reference=oneshot*") 2>/dev/null || true
log_success "Docker image removed"

echo ""

# Ask about removing the entire directory
read -p "Remove the entire OneShot directory? (yes/no) [no]: " REMOVE_DIR
if [[ "$REMOVE_DIR" == "yes" ]]; then
    log_warn "Removing installation directory..."
    cd ..
    rm -rf "$SCRIPT_DIR"
    log_success "OneShot directory removed"
    echo ""
    echo -e "${GREEN}OneShot has been completely uninstalled.${NC}"
else
    log_info "Keeping installation directory (source code preserved)"
    echo ""
    echo -e "${GREEN}OneShot containers and data have been removed.${NC}"
    echo "To reinstall, run: ./install.sh"
fi

echo ""
