#!/bin/sh
set -e

# Restrict default permissions for newly created SQLite journals and uploaded media
umask 027

# Narrow root-only init: repair /app/data ownership/permissions for node, then drop privileges
if [ "$(id -u)" = "0" ]; then
    if [ -L /app/data ]; then
        echo "[PlantStack] Refusing symlink at /app/data for security reasons." >&2
        exit 1
    fi

    mkdir -p /app/data/uploads 2>/dev/null || true

    # Repair regular files and directories only (never follow symlinks inside /app/data)
    find /app/data \( -type d -o -type f \) -exec chown node:node {} + 2>/dev/null || true
    find /app/data -type d -exec chmod 750 {} + 2>/dev/null || true
    find /app/data -type f -exec chmod 640 {} + 2>/dev/null || true

    export HOME=/home/node
    exec su-exec node "$0" "$@"
fi

# Ensure uploads directory exists under unprivileged runtime user
mkdir -p /app/data/uploads 2>/dev/null || true

if [ -z "${PLANTSTACK_API_SECRET:-}" ]; then
    echo "[PlantStack] WARNING: PLANTSTACK_API_SECRET is empty - running in unauthenticated Open LAN Mode." >&2
fi

# Verify write capability on /app/data with crash-loop throttling on failure
if ! touch /app/data/.perm_check 2>/dev/null; then
    echo "==========================================================================" >&2
    echo "PlantStack Storage Error: /app/data is not writable (UID=$(id -u), GID=$(id -g))" >&2
    echo "The unprivileged runtime user cannot write to the SQLite database." >&2
    echo "" >&2
    echo "Fix ownership on your host without world-writable 777 permissions:" >&2
    echo "  docker run --rm -v plantstack_data:/app/data alpine sh -c 'chown -R 1000:1000 /app/data && chmod -R u+rwX,g+rX,o-rwx /app/data'" >&2
    echo "  (or for a host directory: sudo chown -R 1000:1000 ./data && sudo chmod -R u+rwX,g+rX,o-rwx ./data)" >&2
    echo "==========================================================================" >&2
    sleep 30
    exit 1
fi
rm -f /app/data/.perm_check 2>/dev/null || true

# Sync database schema using pre-generated Prisma client (read-only node_modules)
echo "[PlantStack] Syncing database schema with Prisma..."
./node_modules/.bin/prisma db push --accept-data-loss --skip-generate

# Start application server as unprivileged user
if [ $# -gt 0 ]; then
    echo "[PlantStack] Executing command as $(id -un) ($(id -u)): $*"
    exec "$@"
else
    echo "[PlantStack] Starting server as $(id -un) ($(id -u)) on port ${PORT:-3000}..."
    exec node server.js
fi
