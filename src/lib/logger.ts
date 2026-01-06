import pino from 'pino';
import { env } from '../config/env.js';

/**
 * Structured JSON logger using Pino.
 * Observability standard from CID Stack.
 */

// Build logger options - only add transport in development
const loggerOptions: pino.LoggerOptions = {
  level: env.LOG_LEVEL,
  formatters: {
    level: (label) => ({ level: label }),
  },
  timestamp: pino.stdTimeFunctions.isoTime,
};

// Only use pino-pretty in development (it's a devDependency)
if (env.NODE_ENV === 'development') {
  loggerOptions.transport = {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  };
}

export const logger = pino(loggerOptions);

/**
 * Create a child logger with additional context.
 */
export function createLogger(context: Record<string, unknown>) {
  return logger.child(context);
}
