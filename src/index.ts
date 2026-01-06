/**
 * OneShot API Server
 * Voice-first platform for Collaborative Intelligence Development (CID)
 */

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import pinoHttp from 'pino-http';
import { env } from './config/env.js';
import { logger } from './lib/logger.js';
import { errorHandler, notFoundHandler } from './api/middleware/error.js';
import { checkDatabaseConnection, closeDatabaseConnection } from './db/client.js';

// Import routes
import healthRoutes from './api/routes/health.js';
import authRoutes from './api/routes/auth.js';

/**
 * Create and configure Express application.
 */
function createApp() {
  const app = express();

  // Security middleware
  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
    })
  );

  // Request parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(cookieParser());

  // Request logging
  app.use(
    pinoHttp({
      logger,
      customProps: (req) => ({
        requestId: req.id,
      }),
      redact: ['req.headers.authorization', 'req.headers.cookie'],
    })
  );

  // Routes
  app.use('/api', healthRoutes);
  app.use('/api/auth', authRoutes);

  // TODO: Add remaining routes
  // app.use('/api/projects', projectRoutes);
  // app.use('/api/conversations', conversationRoutes);
  // app.use('/api/documents', documentRoutes);
  // app.use('/api/voice', voiceRoutes);
  // app.use('/api/admin', adminRoutes);

  // Error handling
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

/**
 * Start the server.
 */
async function start() {
  // Check database connection
  logger.info('Checking database connection...');
  const dbConnected = await checkDatabaseConnection();
  if (!dbConnected) {
    logger.fatal('Failed to connect to database');
    process.exit(1);
  }
  logger.info('Database connected');

  // Create and start app
  const app = createApp();

  const server = app.listen(env.PORT, () => {
    logger.info({ port: env.PORT, env: env.NODE_ENV }, 'Server started');
  });

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    logger.info({ signal }, 'Shutdown signal received');

    server.close(() => {
      logger.info('HTTP server closed');
    });

    await closeDatabaseConnection();
    logger.info('Database connection closed');

    process.exit(0);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

// Start the application
start().catch((error) => {
  logger.fatal({ error }, 'Failed to start server');
  process.exit(1);
});
