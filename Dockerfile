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

# Create scripts directory if not exists
RUN mkdir -p scripts

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
COPY --from=builder --chown=nodejs:nodejs /app/scripts ./scripts
COPY --from=builder --chown=nodejs:nodejs /docker-entrypoint.sh /docker-entrypoint.sh

# Create upload directory
RUN mkdir -p /app/uploads && chown -R nodejs:nodejs /app/uploads

USER nodejs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5090/api/health/live || exit 1

EXPOSE 5090

ENV NODE_ENV=production
ENV PORT=5090

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["node", "dist/index.js"]
