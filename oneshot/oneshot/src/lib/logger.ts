import pino from 'pino';
import { env } from '../config/env.js';

/**
 * Structured JSON logger using Pino.
 * Observability standard from CID Stack.
 */
export const logger = pino({
  level: env.LOG_LEVEL,
  formatters: {
    level: (label) => ({ level: label }),
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  // Pretty print in development
  transport:
    env.NODE_ENV === 'development'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
});

/**
 * Create a child logger with additional context.
 */
export function createLogger(context: Record<string, unknown>) {
  return logger.child(context);
}
