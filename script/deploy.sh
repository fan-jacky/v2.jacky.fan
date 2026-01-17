#!/bin/bash
set -e

echo "🚀 Starting deployment..."

# Load environment variables if .env file exists
if [ -f .env ]; then
    echo "📋 Loading environment variables from .env"
    export $(cat .env | grep -v '^#' | xargs)
fi

# Set default image if not provided
IMAGE_NAME=${IMAGE_NAME:-ghcr.io/fan-jacky/v2.jacky.fan:latest}
export IMAGE_NAME

echo "📦 Using image: $IMAGE_NAME"

# Stop existing containers
echo "⏹️  Stopping existing containers..."
docker compose -f docker-compose.yml -f docker-compose.deploy.yml down || true

# Pull latest image
echo "⬇️  Pulling latest image..."
docker compose -f docker-compose.yml -f docker-compose.deploy.yml pull

# Start containers
echo "▶️  Starting containers..."
docker compose -f docker-compose.yml -f docker-compose.deploy.yml up -d

# Show running containers
echo "✅ Deployment complete!"
echo ""
echo "📊 Running containers:"
docker compose -f docker-compose.yml -f docker-compose.deploy.yml ps

echo ""
echo "📝 View logs with:"
echo "   docker compose -f docker-compose.yml -f docker-compose.deploy.yml logs -f"
