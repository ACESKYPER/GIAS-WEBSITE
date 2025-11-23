#!/bin/bash
# GIAS Development Setup Script

set -e

echo "=========================================="
echo "GIAS Development Environment Setup"
echo "=========================================="

# Check prerequisites
echo "Checking prerequisites..."

if ! command -v docker &> /dev/null; then
    echo "❌ Docker not installed"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose not installed"
    exit 1
fi

echo "✅ Docker & Docker Compose found"

# Create environment files
echo ""
echo "Creating environment files..."

if [ ! -f "apps/web/.env.local" ]; then
    cat > apps/web/.env.local <<EOF
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_PORTAL_URL=http://localhost:3000/portal
NEXT_PUBLIC_EXPLORER_URL=http://localhost:3000/explorer
NEXTAUTH_SECRET=$(openssl rand -base64 32)
NEXTAUTH_URL=http://localhost:3000
EOF
    echo "✅ Created apps/web/.env.local"
fi

if [ ! -f "apps/api/.env" ]; then
    cat > apps/api/.env <<EOF
DEBUG=true
DATABASE_URL=postgresql://gias_user:gias_password@postgres:5432/gias_db
SECRET_KEY=$(openssl rand -base64 32)
S3_ENDPOINT=http://minio:9000
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin
ENCRYPTION_KEY=$(openssl rand -c 32 | tr -d ' ')
EOF
    echo "✅ Created apps/api/.env"
fi

# Start services
echo ""
echo "Starting services..."
docker-compose up -d

echo ""
echo "Waiting for services to be ready..."
sleep 10

# Check health
echo ""
echo "Checking service health..."

if curl -s http://localhost:8000/health > /dev/null; then
    echo "✅ API is healthy"
else
    echo "⚠️  API is starting..."
fi

if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Frontend is healthy"
else
    echo "⚠️  Frontend is starting..."
fi

# Print summary
echo ""
echo "=========================================="
echo "✅ Setup Complete!"
echo "=========================================="
echo ""
echo "Services are running:"
echo "  • Frontend:     http://localhost:3000"
echo "  • API:          http://localhost:8000"
echo "  • API Docs:     http://localhost:8000/api/docs"
echo "  • MinIO:        http://localhost:9001"
echo "  • PostgreSQL:   localhost:5432"
echo ""
echo "Default Credentials:"
echo "  • MinIO:     minioadmin / minioadmin"
echo "  • Database:  gias_user / gias_password"
echo ""
echo "Useful commands:"
echo "  • View logs:       docker-compose logs -f [service]"
echo "  • Stop services:   docker-compose down"
echo "  • Rebuild images:  docker-compose build"
echo ""
