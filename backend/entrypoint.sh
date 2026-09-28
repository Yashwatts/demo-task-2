#!/bin/sh
set -e

echo "Running migrations..."
npm run migration:run

echo "Seeding database..."
npm run seed

echo "Starting backend..."
npm run start:dev