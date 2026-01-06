import crypto from 'crypto';
import argon2 from 'argon2';
import { env } from '../../config/env.js';

/**
 * Generate a cryptographically secure refresh token.
 * 256-bit random value, base64url encoded.
 */
export function generateRefreshToken(): string {
  return crypto.randomBytes(32).toString('base64url');
}

/**
 * Hash a refresh token for storage.
 * Uses Argon2id for consistency with password hashing.
 */
export async function hashRefreshToken(token: string): Promise<string> {
  return argon2.hash(token, { type: argon2.argon2id });
}

/**
 * Verify a refresh token against its hash.
 */
export async function verifyRefreshToken(
  token: string,
  hash: string
): Promise<boolean> {
  try {
    return await argon2.verify(hash, token);
  } catch {
    return false;
  }
}

/**
 * Calculate refresh token expiry date.
 */
export function getRefreshTokenExpiry(): Date {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + env.REFRESH_TOKEN_EXPIRY_DAYS);
  return expiry;
}

/**
 * Generate a magic link token.
 */
export function generateMagicLinkToken(): string {
  return crypto.randomBytes(32).toString('base64url');
}

/**
 * Calculate magic link expiry date.
 * AUTH-003: Magic links expire in 15 minutes.
 */
export function getMagicLinkExpiry(): Date {
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + env.MAGIC_LINK_EXPIRY_MINUTES);
  return expiry;
}
