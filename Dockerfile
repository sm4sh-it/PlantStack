FROM node:22-alpine AS base

# -----------------------------------------------------------------------------
# CRITICAL RUNTIME ARCHITECTURE: SQLite Volume Permissions & Self-Healing
# PlantStack stores its SQLite database and user uploads in /app/data (mounted volume).
# Depending on host deployment (Dockhand, Portainer, Synology, Docker Compose),
# containers may boot as UID 0 (root) or UID 1000 (node).
# OpenSSL is required by Prisma on Alpine (musl).
# Sudo with NOPASSWD allows entrypoint self-healing (chmod -R 777 /app/data)
# even when container managers force unprivileged UID 1000 execution. DO NOT REMOVE.
# -----------------------------------------------------------------------------
RUN apk add --no-cache openssl sudo && \
    adduser node wheel 2>/dev/null || true && \
    echo "node ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers && \
    mkdir -p /etc/sudoers.d && \
    echo "node ALL=(ALL) NOPASSWD: ALL" > /etc/sudoers.d/node && \
    chmod 0440 /etc/sudoers.d/node

WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Build the app
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate prisma client inside builder
RUN npx prisma generate

# Create the placeholder for data directory and public directory
RUN mkdir -p /app/data/uploads /app/public

ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL="file:/app/data/database.db"

# Next.js build
RUN npm run build

# Production image
FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL="file:/app/data/database.db"
ENV DATA_DIR="/app/data/uploads"

RUN mkdir -p /app/data/uploads /app/public

# Copy built application and required production dependencies
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER root

COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 3000
ENV PORT=3000

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", "server.js"]
