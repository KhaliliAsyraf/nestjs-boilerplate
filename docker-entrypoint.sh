#!/bin/sh

# Run migrations
echo "Running database migrations..."
npm run typeorm migration:run -- -d dist/config/typeorm.config.js

# Start the application
echo "Starting application..."
exec npm run start:dev
