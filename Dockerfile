# syntax=docker/dockerfile:1

# ============================================
# Build Stage
# ============================================
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies first (cache layer)
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# Generate database migrations
RUN npm run db:generate || true

# Ensure drizzle directory exists
RUN mkdir -p drizzle

# Copy startup script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Prune dev dependencies
RUN npm prune --production

# ============================================
# Production Stage
# ============================================
FROM node:22-alpine AS production

# Install netcat for database health check
RUN apk add --no-cache netcat-openbsd

# Security: run as non-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copy only what's needed
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/package.json ./
COPY --from=builder --chown=nodejs:nodejs /app/drizzle ./drizzle
COPY --from=builder --chown=nodejs:nodejs /app/drizzle.config.ts ./drizzle.config.ts
COPY --from=builder --chown=nodejs:nodejs /app/src/db/schema.ts ./src/db/schema.ts
COPY --from=builder --chown=nodejs:nodejs /docker-entrypoint.sh /docker-entrypoint.sh

# Install drizzle-kit and tsx for migrations
RUN npm install drizzle-kit tsx typescript

# Create upload directory and ensure schema dir exists
RUN mkdir -p /app/uploads /app/src/db && chown -R nodejs:nodejs /app/uploads /app/src

USER nodejs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5090/api/health/live || exit 1

EXPOSE 5090

ENV NODE_ENV=production
ENV PORT=5090

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["node", "dist/index.js"]
