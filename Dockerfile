FROM node:20-alpine AS base

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json ./
# Since there is no package-lock.json initially, just install everything
RUN npm install

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

# Create next user and group for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set correct permissions
RUN mkdir -p /app/data/uploads && chown -R nextjs:nodejs /app/data

# Copy built application and required production dependencies
RUN mkdir -p /app/public
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy prisma stuff for migrations run at startup
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 3000
ENV PORT=3000

# Wrapper script to run migrations and start
CMD ["sh", "-c", "npx prisma db push --accept-data-loss && node server.js"]
