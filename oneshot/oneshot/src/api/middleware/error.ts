import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from '../../lib/logger.js';
import { env } from '../../config/env.js';

/**
 * Standard error codes.
 * API-001: Standard error response format.
 */
export type ErrorCode =
  | 'VALIDATION_ERROR'
  | 'AUTHENTICATION_REQUIRED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'RATE_LIMITED'
  | 'INTERNAL_ERROR';

/**
 * Application error with code and details.
 */
export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public statusCode: number = 500,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * Common error factories.
 */
export const errors = {
  validation: (message: string, details?: Record<string, unknown>) =>
    new AppError('VALIDATION_ERROR', message, 400, details),

  unauthorized: (message = 'Authentication required') =>
    new AppError('AUTHENTICATION_REQUIRED', message, 401),

  forbidden: (message = 'Access denied') =>
    new AppError('FORBIDDEN', message, 403),

  notFound: (resource = 'Resource') =>
    new AppError('NOT_FOUND', `${resource} not found`, 404),

  conflict: (message: string) =>
    new AppError('CONFLICT', message, 409),

  rateLimited: (message = 'Too many requests') =>
    new AppError('RATE_LIMITED', message, 429),

  internal: (message = 'Internal server error') =>
    new AppError('INTERNAL_ERROR', message, 500),
};

/**
 * Global error handling middleware.
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Handle Zod validation errors
  if (err instanceof ZodError) {
    res.status(400).json({
      code: 'VALIDATION_ERROR',
      message: 'Invalid request data',
      details: err.flatten(),
    });
    return;
  }

  // Handle application errors
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      code: err.code,
      message: err.message,
      details: err.details,
    });
    return;
  }

  // Log unexpected errors
  logger.error({ err }, 'Unhandled error');

  // Don't leak error details in production
  res.status(500).json({
    code: 'INTERNAL_ERROR',
    message: env.NODE_ENV === 'production' 
      ? 'An unexpected error occurred' 
      : err.message,
  });
}

/**
 * 404 handler for unmatched routes.
 */
export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({
    code: 'NOT_FOUND',
    message: 'Endpoint not found',
  });
}
