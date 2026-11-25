FROM node:22-alpine@sha256:1314fb30ec37592d5845e5a160d522c0e680972aa534549940b8d73bde88481a AS base

# -----------------------------------------------------------------------------
# RUNTIME ARCHITECTURE: Least-Privilege Drop & SQLite Volume Self-Healing
# PlantStack stores its SQLite database and user uploads in /app/data.
# OpenSSL is required by Prisma on Alpine (musl).
# No sudo/NOPASSWD is granted; root-level volume repair happens solely in
# docker-entrypoint.sh before permanently dropping privileges via su-exec node.
# -----------------------------------------------------------------------------
RUN apk add --no-cache openssl

WORKDIR /app

# Install dependencies strictly from package-lock.json
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

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
ENV CHECKPOINT_DISABLE=1
ENV DATABASE_URL="file:/app/data/database.db"
ENV DATA_DIR="/app/data/uploads"

RUN apk add --no-cache su-exec

# Copy Next.js standalone output (includes traced runtime node_modules: next, sharp, @img, adm-zip, @prisma/client)
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/CHANGELOG.md ./CHANGELOG.md
COPY --from=builder /app/package.json ./package.json

# Copy Prisma schema, generated client, and CLI/engines strictly needed by entrypoint `prisma db push --skip-generate`
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

RUN mkdir -p /app/node_modules/.bin /app/data/uploads /app/public /app/.next/cache && \
    chmod 0755 /app/node_modules/prisma/build/index.js && \
    ln -sf ../prisma/build/index.js /app/node_modules/.bin/prisma && \
    chown -R node:node /app/.next/cache /app/data

# Container boots as root only when host runtime does not force --user 1000 so
# docker-entrypoint.sh can reconcile /app/data for node:node, then exec su-exec node.
USER root

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod 0755 /usr/local/bin/docker-entrypoint.sh

EXPOSE 3000
ENV PORT=3000

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["node", "server.js"]
