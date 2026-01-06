import type { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../../lib/auth/jwt.js';
import { logger } from '../../lib/logger.js';

/**
 * Extended request with authenticated user context.
 */
export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    role: string;
  };
}

/**
 * Type guard to check if request is authenticated.
 */
export function isAuthenticated(req: Request): req is AuthenticatedRequest {
  return 'user' in req && typeof (req as AuthenticatedRequest).user?.id === 'string';
}

/**
 * Authentication middleware.
 * AUTH-001: All API routes require authentication except /auth/*
 * 
 * Validates JWT Bearer token and attaches user context to request.
 */
export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({
      code: 'AUTHENTICATION_REQUIRED',
      message: 'Missing or invalid authorization header',
    });
    return;
  }

  const token = authHeader.slice(7);

  try {
    const payload = verifyAccessToken(token);
    (req as AuthenticatedRequest).user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
    next();
  } catch (error) {
    logger.debug({ error }, 'Token verification failed');
    res.status(401).json({
      code: 'AUTHENTICATION_REQUIRED',
      message: 'Invalid or expired token',
    });
  }
}

/**
 * Role-based authorization middleware.
 * AUTHZ-002: Admin routes restricted to admin role.
 * AUTHZ-003: Super admin functions require super_admin role.
 */
export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!isAuthenticated(req)) {
      res.status(401).json({
        code: 'AUTHENTICATION_REQUIRED',
        message: 'Authentication required',
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        code: 'FORBIDDEN',
        message: 'Insufficient permissions',
      });
      return;
    }

    next();
  };
}

/**
 * Convenience middleware for admin routes.
 */
export const requireAdmin = requireRole('admin', 'super_admin');

/**
 * Convenience middleware for super admin routes.
 */
export const requireSuperAdmin = requireRole('super_admin');
