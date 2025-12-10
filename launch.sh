#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Teza Dashboard Launcher${NC}"
echo "================================="

# Check if PostgreSQL is running
echo -e "${YELLOW}Checking PostgreSQL...${NC}"
if ! pgrep -x "postgres" > /dev/null; then
    echo -e "${RED}PostgreSQL is not running!${NC}"
    echo "Start it with: brew services start postgresql@15"
    exit 1
fi
echo -e "${GREEN}✅ PostgreSQL is running${NC}"

# Check if database exists
echo -e "${YELLOW}Checking database...${NC}"
if ! psql -U postgres -lqt | cut -d \| -f 1 | grep -qw "teza_dashboard"; then
    echo -e "${YELLOW}Creating database...${NC}"
    psql -U postgres -c "CREATE DATABASE teza_dashboard;" 2>/dev/null
    echo -e "${GREEN}✅ Database created${NC}"
else
    echo -e "${GREEN}✅ Database exists${NC}"
fi

# Start Backend
echo -e "${YELLOW}Starting Backend Server...${NC}"
cd "$(dirname "$0")/backend"
npm run dev > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
echo -e "${GREEN}✅ Backend started (PID: $BACKEND_PID)${NC}"

# Wait a bit for backend to start
sleep 2

# Check if backend is responding
if curl -s http://localhost:3001/health > /dev/null; then
    echo -e "${GREEN}✅ Backend is responding${NC}"
else
    echo -e "${RED}❌ Backend failed to start${NC}"
    echo "Check /tmp/backend.log for errors"
    kill $BACKEND_PID
    exit 1
fi

# Start Frontend
echo -e "${YELLOW}Starting Frontend Server...${NC}"
cd "$(dirname "$0")"
npm run dev > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
echo -e "${GREEN}✅ Frontend started (PID: $FRONTEND_PID)${NC}"

echo ""
echo -e "${GREEN}================================="
echo "✅ All servers are running!"
echo "=================================${NC}"
echo ""
echo -e "Frontend: ${GREEN}http://localhost:3000${NC}"
echo -e "Backend: ${GREEN}http://localhost:3001${NC}"
echo -e "Docs: ${GREEN}README_LAUNCH.md${NC}"
echo ""
echo -e "Logs:"
echo -e "  Backend: ${YELLOW}tail -f /tmp/backend.log${NC}"
echo -e "  Frontend: ${YELLOW}tail -f /tmp/frontend.log${NC}"
echo ""
echo -e "To stop all servers: ${YELLOW}killall node${NC}"
echo ""
