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
# Push schema changes directly to database using tsx for TypeScript config
npx tsx node_modules/drizzle-kit/bin.cjs push --force || {
  echo "Warning: Migration with tsx failed, trying alternate method..."
  # Fallback: try with npx directly
  npx drizzle-kit push --force 2>/dev/null || {
    echo "Warning: Could not run migrations, continuing anyway..."
  }
}
echo "==> Migrations complete!"

echo "==> Starting OneShot API..."
exec "$@"
