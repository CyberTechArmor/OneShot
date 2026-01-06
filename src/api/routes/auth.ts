/**
 * Authentication Routes
 * Implements email/password and magic link authentication.
 * 
 * AUTH-001: All API routes require authentication except /auth/*
 */

import { Router } from 'express';
import { z } from 'zod';
import { eq, and, isNull, gt } from 'drizzle-orm';
import { db } from '../../db/client.js';
import { users, refreshTokens, magicLinks } from '../../db/schema.js';
import { validateBody } from '../middleware/validate.js';
import { requireAuth, type AuthenticatedRequest } from '../middleware/auth.js';
import { errors } from '../middleware/error.js';
import {
  hashPassword,
  verifyPassword,
  signAccessToken,
  generateRefreshToken,
  hashRefreshToken,
  verifyRefreshToken,
  getRefreshTokenExpiry,
  generateMagicLinkToken,
  getMagicLinkExpiry,
} from '../../lib/auth/index.js';
import { logger } from '../../lib/logger.js';

const router = Router();

// ============================================================================
// Schemas
// ============================================================================

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).max(100).optional(),
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const MagicLinkSchema = z.object({
  email: z.string().email(),
});

const VerifyMagicLinkSchema = z.object({
  token: z.string().min(1),
});

const RefreshSchema = z.object({
  refreshToken: z.string().min(1),
});

// ============================================================================
// Routes
// ============================================================================

/**
 * POST /api/auth/register
 * Register a new user.
 */
router.post('/register', validateBody(RegisterSchema), async (req, res, next) => {
  try {
    const { email, password, name } = req.body as z.infer<typeof RegisterSchema>;

    // Check if user exists
    const existing = await db.query.users.findFirst({
      where: eq(users.email, email.toLowerCase()),
    });

    if (existing) {
      throw errors.conflict('Email already registered');
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Check if this is the first user (becomes super_admin)
    const userCount = await db.select().from(users).limit(1);
    const isFirstUser = userCount.length === 0;

    // Create user
    const [user] = await db
      .insert(users)
      .values({
        email: email.toLowerCase(),
        passwordHash,
        name,
        role: isFirstUser ? 'super_admin' : 'user',
        emailVerified: false,
      })
      .returning();

    if (!user) {
      throw errors.internal('Failed to create user');
    }

    logger.info({ userId: user.id, isFirstUser }, 'User registered');

    // Generate tokens
    const accessToken = signAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken();
    const refreshTokenHash = await hashRefreshToken(refreshToken);

    // Store refresh token
    await db.insert(refreshTokens).values({
      userId: user.id,
      tokenHash: refreshTokenHash,
      expiresAt: getRefreshTokenExpiry(),
    });

    res.status(201).json({
      accessToken,
      refreshToken,
      expiresIn: 900, // 15 minutes in seconds
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/auth/login
 * Login with email and password.
 */
router.post('/login', validateBody(LoginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body as z.infer<typeof LoginSchema>;

    // Find user
    const user = await db.query.users.findFirst({
      where: and(
        eq(users.email, email.toLowerCase()),
        isNull(users.deletedAt)
      ),
    });

    if (!user || !user.passwordHash) {
      throw errors.unauthorized('Invalid credentials');
    }

    // Verify password
    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      throw errors.unauthorized('Invalid credentials');
    }

    // Update last login
    await db
      .update(users)
      .set({ lastLoginAt: new Date(), updatedAt: new Date() })
      .where(eq(users.id, user.id));

    logger.info({ userId: user.id }, 'User logged in');

    // Generate tokens
    const accessToken = signAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken();
    const refreshTokenHash = await hashRefreshToken(refreshToken);

    // Store refresh token
    await db.insert(refreshTokens).values({
      userId: user.id,
      tokenHash: refreshTokenHash,
      expiresAt: getRefreshTokenExpiry(),
    });

    res.json({
      accessToken,
      refreshToken,
      expiresIn: 900,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/auth/magic-link
 * Request a magic link email.
 */
router.post('/magic-link', validateBody(MagicLinkSchema), async (req, res, next) => {
  try {
    const { email } = req.body as z.infer<typeof MagicLinkSchema>;

    // Always return success to prevent email enumeration
    const successResponse = {
      message: 'If an account exists, a magic link has been sent',
    };

    // Find user
    const user = await db.query.users.findFirst({
      where: and(
        eq(users.email, email.toLowerCase()),
        isNull(users.deletedAt)
      ),
    });

    if (!user) {
      // Don't reveal if user exists
      res.json(successResponse);
      return;
    }

    // Generate magic link token
    const token = generateMagicLinkToken();

    // Store magic link
    await db.insert(magicLinks).values({
      userId: user.id,
      token,
      expiresAt: getMagicLinkExpiry(),
    });

    // TODO: Send email with magic link
    // For now, log the token (development only)
    logger.info({ userId: user.id, token }, 'Magic link generated (send email in production)');

    res.json(successResponse);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/auth/verify-magic-link
 * Verify a magic link token.
 */
router.post('/verify-magic-link', validateBody(VerifyMagicLinkSchema), async (req, res, next) => {
  try {
    const { token } = req.body as z.infer<typeof VerifyMagicLinkSchema>;

    // Find valid magic link
    const magicLink = await db.query.magicLinks.findFirst({
      where: and(
        eq(magicLinks.token, token),
        isNull(magicLinks.usedAt),
        gt(magicLinks.expiresAt, new Date())
      ),
      with: {
        user: true,
      },
    });

    if (!magicLink || !magicLink.user) {
      throw errors.unauthorized('Invalid or expired magic link');
    }

    // Mark as used
    await db
      .update(magicLinks)
      .set({ usedAt: new Date() })
      .where(eq(magicLinks.id, magicLink.id));

    // Mark email as verified
    await db
      .update(users)
      .set({ emailVerified: true, lastLoginAt: new Date(), updatedAt: new Date() })
      .where(eq(users.id, magicLink.userId));

    logger.info({ userId: magicLink.userId }, 'Magic link verified');

    // Generate tokens
    const accessToken = signAccessToken({
      sub: magicLink.user.id,
      email: magicLink.user.email,
      role: magicLink.user.role,
    });

    const refreshToken = generateRefreshToken();
    const refreshTokenHash = await hashRefreshToken(refreshToken);

    await db.insert(refreshTokens).values({
      userId: magicLink.userId,
      tokenHash: refreshTokenHash,
      expiresAt: getRefreshTokenExpiry(),
    });

    res.json({
      accessToken,
      refreshToken,
      expiresIn: 900,
      user: {
        id: magicLink.user.id,
        email: magicLink.user.email,
        name: magicLink.user.name,
        role: magicLink.user.role,
        emailVerified: true,
        createdAt: magicLink.user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token.
 */
router.post('/refresh', validateBody(RefreshSchema), async (req, res, next) => {
  try {
    const { refreshToken: token } = req.body as z.infer<typeof RefreshSchema>;

    // Find all valid refresh tokens for comparison
    const validTokens = await db.query.refreshTokens.findMany({
      where: and(
        isNull(refreshTokens.revokedAt),
        gt(refreshTokens.expiresAt, new Date())
      ),
      with: {
        user: true,
      },
    });

    // Find matching token
    let matchedToken = null;
    for (const storedToken of validTokens) {
      const isMatch = await verifyRefreshToken(token, storedToken.tokenHash);
      if (isMatch) {
        matchedToken = storedToken;
        break;
      }
    }

    if (!matchedToken || !matchedToken.user) {
      throw errors.unauthorized('Invalid refresh token');
    }

    // Revoke old token (rotation)
    await db
      .update(refreshTokens)
      .set({ revokedAt: new Date() })
      .where(eq(refreshTokens.id, matchedToken.id));

    // Generate new tokens
    const accessToken = signAccessToken({
      sub: matchedToken.user.id,
      email: matchedToken.user.email,
      role: matchedToken.user.role,
    });

    const newRefreshToken = generateRefreshToken();
    const refreshTokenHash = await hashRefreshToken(newRefreshToken);

    await db.insert(refreshTokens).values({
      userId: matchedToken.userId,
      tokenHash: refreshTokenHash,
      expiresAt: getRefreshTokenExpiry(),
    });

    res.json({
      accessToken,
      refreshToken: newRefreshToken,
      expiresIn: 900,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/auth/logout
 * Logout and revoke refresh token.
 */
router.post('/logout', requireAuth, validateBody(RefreshSchema), async (req, res, next) => {
  try {
    const { refreshToken: token } = req.body as z.infer<typeof RefreshSchema>;
    const authReq = req as AuthenticatedRequest;

    // Find and revoke the token
    const validTokens = await db.query.refreshTokens.findMany({
      where: and(
        eq(refreshTokens.userId, authReq.user.id),
        isNull(refreshTokens.revokedAt)
      ),
    });

    for (const storedToken of validTokens) {
      const isMatch = await verifyRefreshToken(token, storedToken.tokenHash);
      if (isMatch) {
        await db
          .update(refreshTokens)
          .set({ revokedAt: new Date() })
          .where(eq(refreshTokens.id, storedToken.id));
        break;
      }
    }

    logger.info({ userId: authReq.user.id }, 'User logged out');

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/auth/me
 * Get current user info.
 */
router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;

    const user = await db.query.users.findFirst({
      where: eq(users.id, authReq.user.id),
    });

    if (!user) {
      throw errors.notFound('User');
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
