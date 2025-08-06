#!/bin/bash

# Quantify - Start Script
# Runs both backend and frontend servers simultaneously

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[QUANTIFY]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Function to cleanup processes on exit
cleanup() {
    print_status "Shutting down servers..."
    jobs -p | xargs -r kill
    exit 0
}

# Set up trap to cleanup on script exit
trap cleanup SIGINT SIGTERM EXIT

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

print_status "Starting Quantify Development Environment..."
echo ""

# Check if backend dependencies are installed
if [ ! -d "backend/node_modules" ]; then
    print_warning "Backend dependencies not found. Installing..."
    cd backend
    npm install
    cd ..
    print_success "Backend dependencies installed!"
fi

# Check if frontend dependencies are installed
if [ ! -d "node_modules" ]; then
    print_warning "Frontend dependencies not found. Installing..."
    npm install
    print_success "Frontend dependencies installed!"
fi

# Check if MongoDB is running (optional)
if command -v mongod &> /dev/null; then
    if ! pgrep -x "mongod" > /dev/null; then
        print_warning "MongoDB is not running. You may need to start it manually:"
        echo "  brew services start mongodb-community"
        echo "  or: mongod"
    else
        print_success "MongoDB is running!"
    fi
fi

# Create log directory
mkdir -p logs

print_status "Starting backend server (Port 5001)..."
cd backend
npm run dev > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
cd ..

print_status "Starting frontend server (Port 5173)..."
npm run dev > logs/frontend.log 2>&1 &
FRONTEND_PID=$!

# Wait a moment for servers to start
sleep 3

# Check if backend is running
if ps -p $BACKEND_PID > /dev/null; then
    print_success "Backend server started successfully!"
    echo "  🔗 API: http://localhost:5001/api"
    echo "  💚 Health: http://localhost:5001/health"
else
    print_error "Failed to start backend server. Check logs/backend.log"
fi

# Check if frontend is running
if ps -p $FRONTEND_PID > /dev/null; then
    print_success "Frontend server started successfully!"
    echo "  🌐 App: http://localhost:5173"
    echo "  📊 Stock Dashboard: http://localhost:5173/stock-api"
    echo "  💻 API Demo: http://localhost:5173/api-example"
else
    print_error "Failed to start frontend server. Check logs/frontend.log"
fi

echo ""
print_status "Both servers are running! Press Ctrl+C to stop."
echo ""
echo "📋 Quick Links:"
echo "  Frontend:  http://localhost:5173"
echo "  Backend:   http://localhost:5001/api"
echo "  Health:    http://localhost:5001/health"
echo ""
echo "📁 Log Files:"
echo "  Backend:   logs/backend.log"
echo "  Frontend:  logs/frontend.log"
echo ""
echo "🔧 Useful Commands:"
echo "  tail -f logs/backend.log   # View backend logs"
echo "  tail -f logs/frontend.log  # View frontend logs"
echo "  curl http://localhost:5001/health  # Test backend"
echo ""

# Monitor both processes
while true; do
    if ! ps -p $BACKEND_PID > /dev/null; then
        print_error "Backend server stopped unexpectedly!"
        print_status "Check logs/backend.log for details"
        break
    fi
    
    if ! ps -p $FRONTEND_PID > /dev/null; then
        print_error "Frontend server stopped unexpectedly!"
        print_status "Check logs/frontend.log for details"
        break
    fi
    
    sleep 5
done

# Keep script running until user interrupts
wait
