#!/bin/sh
set -e

echo "[plantstack-entrypoint] Initializing container (UID=$(id -u), GID=$(id -g))..."

# Ensure data and upload directories exist
mkdir -p /app/data/uploads

# Ensure full read/write permissions on SQLite data volume (ownership and access rights)
echo "[plantstack-entrypoint] Reconciling permissions for /app/data..."
chown -R node:node /app/data 2>/dev/null || true
chmod -R a+rwX /app/data 2>/dev/null || true

# If running as root, drop privileges to node user
if [ "$(id -u)" = '0' ]; then
    echo "[plantstack-entrypoint] Dropping privileges to unprivileged 'node' user..."
    exec su-exec node "$@"
else
    echo "[plantstack-entrypoint] Running as unprivileged user $(id -u)..."
    exec "$@"
fi
