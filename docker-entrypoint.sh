#!/bin/sh
set -e

# Ensure permissive umask for newly created files/directories
umask 000

# Helper to run commands as root (handles root, sudo, and unprivileged fallback)
run_root() {
    if [ "$(id -u)" = "0" ]; then
        "$@"
    elif command -v sudo >/dev/null 2>&1; then
        sudo -n "$@" 2>/dev/null || "$@"
    else
        "$@"
    fi
}

# Ensure uploads directory exists
run_root mkdir -p /app/data/uploads 2>/dev/null || mkdir -p /app/data/uploads 2>/dev/null || true

# Reconcile volume permissions on /app/data for all UIDs
run_root chmod -R 777 /app/data 2>/dev/null || true

# Verify write capability on data directory
if ! touch /app/data/.perm_check 2>/dev/null; then
    run_root touch /app/data/.perm_check 2>/dev/null || true
    run_root chmod 666 /app/data/.perm_check 2>/dev/null || true
fi
if ! touch /app/data/.perm_check 2>/dev/null; then
    echo "=========================================================================="
    echo "❌ PlantStack Storage Error: /app/data is not writable (UID=$(id -u), GID=$(id -g))"
    echo "The container process cannot write to the SQLite database."
    echo ""
    echo "To fix this permission mismatch, run this one-line command on your host:"
    echo "  docker run --rm -v plantstack_data:/app/data alpine chmod -R 777 /app/data"
    echo "  (or if using a host directory: sudo chmod -R 777 ./data)"
    echo "=========================================================================="
    sleep 30
    exit 1
fi
rm -f /app/data/.perm_check 2>/dev/null || true

# Run database schema migration
echo "[PlantStack] Syncing database schema with Prisma..."
npx prisma db push --accept-data-loss

# Start application server
if [ $# -gt 0 ]; then
    echo "[PlantStack] Executing custom command: $@"
    exec "$@"
else
    echo "[PlantStack] Starting server on port ${PORT:-3000}..."
    exec node server.js
fi
