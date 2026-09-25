#!/bin/sh
set -e

echo "Running migrations..."

npm run migration:run

echo "Starting backend..."

npm run start:dev