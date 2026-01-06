#!/bin/sh
set -e

echo "==> Waiting for database to be ready..."
# Wait for database to be available
until nc -z ${DATABASE_HOST:-db} ${DATABASE_PORT:-5432} 2>/dev/null; do
  echo "Database not ready, waiting..."
  sleep 2
done
echo "==> Database is ready!"

echo "==> Running database migrations..."
# Run migration script using Node.js directly
node /app/scripts/migrate.js || {
  echo "Warning: Migration script had errors, continuing anyway..."
}

echo "==> Starting OneShot API..."
exec "$@"
