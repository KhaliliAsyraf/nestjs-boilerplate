#!/bin/bash

# NestJS Boilerplate Setup Script
# This script helps you set up the project quickly

set -e

echo "🚀 NestJS Boilerplate Setup"
echo "============================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Docker is installed${NC}"
echo -e "${GREEN}✓ Docker Compose is installed${NC}"
echo ""

# Copy .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo -e "${GREEN}✓ .env file created${NC}"
    echo -e "${YELLOW}⚠️  Please update .env with your configuration${NC}"
else
    echo -e "${YELLOW}⚠️  .env file already exists, skipping...${NC}"
fi
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
if command -v npm &> /dev/null; then
    npm install
    echo -e "${GREEN}✓ Dependencies installed${NC}"
else
    echo -e "${RED}❌ npm is not installed. Please install Node.js and npm first.${NC}"
    exit 1
fi
echo ""

# Start Docker services
echo "🐳 Starting Docker services..."
docker-compose up -d
echo -e "${GREEN}✓ Docker services started${NC}"
echo ""

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 10
echo -e "${GREEN}✓ PostgreSQL is ready${NC}"
echo ""

# Run migrations
echo "🔄 Running database migrations..."
npm run migration:run
echo -e "${GREEN}✓ Migrations completed${NC}"
echo ""

# Seed database
echo "🌱 Seeding database..."
npm run seed
echo -e "${GREEN}✓ Database seeded${NC}"
echo ""

echo "================================"
echo -e "${GREEN}✅ Setup completed successfully!${NC}"
echo "================================"
echo ""
echo "📍 Access points:"
echo "   - API: http://localhost/api"
echo "   - Swagger: http://localhost/api/docs"
echo "   - RabbitMQ: http://localhost:15672 (admin/admin)"
echo ""
echo "🔐 Default credentials:"
echo "   Admin: admin@example.com / Admin123!"
echo "   User: user@example.com / User123!"
echo ""
echo "🚀 Start development server:"
echo "   npm run start:dev"
echo ""
echo "📚 Documentation:"
echo "   - README.md"
echo "   - docs/QUICKSTART.md"
echo "   - docs/API_TESTING.md"
echo ""
echo -e "${GREEN}Happy coding! 🎉${NC}"
