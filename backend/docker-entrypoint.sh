#!/bin/sh
set -e

echo "Waiting for database..."

until nc -z $DB_HOST 3306; do
  sleep 1
done

echo "Database is ready!"

echo "Running Prisma migrations..."
npx prisma migrate deploy

echo "Starting server..."
node ./src/server.js