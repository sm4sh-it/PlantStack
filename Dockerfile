FROM node:22-alpine AS base

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

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

# Create application and data directories with node user ownership
RUN mkdir -p /app/data/uploads /app/public && \
    chown -R node:node /app

# Copy built application and required production dependencies with node ownership
COPY --chown=node:node --from=builder /app/public ./public
COPY --chown=node:node --from=builder /app/.next/standalone ./
COPY --chown=node:node --from=builder /app/.next/static ./.next/static

# Copy prisma stuff for migrations run at startup
COPY --chown=node:node --from=builder /app/prisma ./prisma
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/package.json ./package.json

# Ensure data directory permissions
RUN chown -R node:node /app/data

USER node

EXPOSE 3000
ENV PORT=3000

# Wrapper script to run migrations and start
CMD ["sh", "-c", "npx prisma db push --accept-data-loss && node server.js"]
