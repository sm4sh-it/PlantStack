#!/bin/sh
set -e

# If running as root, fix volume permissions and drop privileges to node
if [ "$(id -u)" = '0' ]; then
    mkdir -p /app/data/uploads
    chown -R node:node /app/data
    exec su-exec node "$@"
fi

# If already running as non-root, directly execute the command
exec "$@"
