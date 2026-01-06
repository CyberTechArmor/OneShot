import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';

/**
 * Access token payload structure.
 */
export interface AccessTokenPayload {
  /** User ID (UUID) */
  sub: string;
  /** User email */
  email: string;
  /** User role */
  role: string;
  /** Issued at (Unix timestamp) */
  iat: number;
  /** Expiry (Unix timestamp) */
  exp: number;
}

/**
 * Sign an access token (15 minute expiry by default).
 */
export function signAccessToken(payload: Omit<AccessTokenPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRY,
  });
}

/**
 * Verify and decode an access token.
 * Throws if invalid or expired.
 */
export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, env.JWT_SECRET) as AccessTokenPayload;
}

/**
 * Decode a token without verification (for debugging).
 */
export function decodeToken(token: string): AccessTokenPayload | null {
  const decoded = jwt.decode(token);
  return decoded as AccessTokenPayload | null;
}

/**
 * Check if a token is expired without throwing.
 */
export function isTokenExpired(token: string): boolean {
  try {
    const decoded = decodeToken(token);
    if (!decoded?.exp) return true;
    return Date.now() >= decoded.exp * 1000;
  } catch {
    return true;
  }
}
