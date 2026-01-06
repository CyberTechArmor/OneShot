/**
 * Health Check Routes
 * Provides endpoints for load balancer and monitoring.
 */

import { Router } from 'express';
import { checkDatabaseConnection } from '../../db/client.js';
import { isVoiceConfigured, isAiVendorConfigured } from '../../config/env.js';

const router = Router();

/**
 * GET /api/health
 * Comprehensive health check.
 */
router.get('/health', async (_req, res) => {
  const checks = {
    status: 'ok' as 'ok' | 'degraded' | 'unhealthy',
    timestamp: new Date().toISOString(),
    checks: {
      database: 'unknown' as 'ok' | 'error' | 'unknown',
      ai: 'unknown' as 'ok' | 'error' | 'unknown',
      voice: 'unknown' as 'ok' | 'error' | 'unknown',
    },
  };

  // Check database
  try {
    const dbConnected = await checkDatabaseConnection();
    checks.checks.database = dbConnected ? 'ok' : 'error';
    if (!dbConnected) checks.status = 'degraded';
  } catch {
    checks.checks.database = 'error';
    checks.status = 'degraded';
  }

  // Check AI vendor
  if (isAiVendorConfigured('anthropic') || isAiVendorConfigured('openai')) {
    checks.checks.ai = 'ok';
  } else {
    checks.checks.ai = 'error';
    checks.status = 'degraded';
  }

  // Check voice
  if (isVoiceConfigured()) {
    checks.checks.voice = 'ok';
  } else {
    // Voice is optional, just note it's unconfigured
    checks.checks.voice = 'error';
  }

  const statusCode = checks.status === 'ok' ? 200 : 503;
  res.status(statusCode).json(checks);
});

/**
 * GET /api/health/ready
 * Readiness probe for Kubernetes.
 */
router.get('/health/ready', async (_req, res) => {
  try {
    const dbConnected = await checkDatabaseConnection();
    if (dbConnected) {
      res.status(200).json({ ready: true });
    } else {
      res.status(503).json({ ready: false });
    }
  } catch {
    res.status(503).json({ ready: false });
  }
});

/**
 * GET /api/health/live
 * Liveness probe for Kubernetes.
 */
router.get('/health/live', (_req, res) => {
  res.status(200).json({ alive: true });
});

export default router;
