import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema } from 'zod';

/**
 * Request validation middleware factory.
 * API-002: Request validation with Zod.
 * 
 * @example
 * router.post('/projects', validate(CreateProjectSchema), createProject);
 */
export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        code: 'VALIDATION_ERROR',
        message: 'Invalid request body',
        details: result.error.flatten(),
      });
      return;
    }

    // Replace body with parsed/transformed data
    req.body = result.data;
    next();
  };
}

/**
 * Query parameter validation middleware factory.
 */
export function validateQuery<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      res.status(400).json({
        code: 'VALIDATION_ERROR',
        message: 'Invalid query parameters',
        details: result.error.flatten(),
      });
      return;
    }

    req.query = result.data as typeof req.query;
    next();
  };
}

/**
 * Path parameter validation middleware factory.
 */
export function validateParams<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.params);

    if (!result.success) {
      res.status(400).json({
        code: 'VALIDATION_ERROR',
        message: 'Invalid path parameters',
        details: result.error.flatten(),
      });
      return;
    }

    req.params = result.data as typeof req.params;
    next();
  };
}
