#!/bin/bash

# Quantify - Stop Script
# Stops all Quantify development servers

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[QUANTIFY]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_status "Stopping Quantify development servers..."

# Kill processes running on ports 5001 (backend) and 5173 (frontend)
BACKEND_PID=$(lsof -ti:5001)
FRONTEND_PID=$(lsof -ti:5173)

if [ ! -z "$BACKEND_PID" ]; then
    kill $BACKEND_PID
    print_success "Backend server stopped (PID: $BACKEND_PID)"
else
    print_status "No backend server running on port 5001"
fi

if [ ! -z "$FRONTEND_PID" ]; then
    kill $FRONTEND_PID
    print_success "Frontend server stopped (PID: $FRONTEND_PID)"
else
    print_status "No frontend server running on port 5173"
fi

# Kill any remaining node processes related to the project
pkill -f "npm run dev" 2>/dev/null || true
pkill -f "nodemon" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true

print_success "All Quantify servers stopped!"
