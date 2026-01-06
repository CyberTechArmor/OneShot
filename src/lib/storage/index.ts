/**
 * Storage Provider Manager
 * ARCH-003: Storage abstraction layer.
 */

import type { StorageProvider } from './types.js';
import { LocalStorageProvider } from './providers/local.js';
import { S3StorageProvider } from './providers/s3.js';
import { env } from '../config/env.js';
import { logger } from './logger.js';

export type StorageType = 'local' | 's3';

/**
 * Get the configured storage provider.
 */
export function getStorageProvider(): StorageProvider {
  if (env.STORAGE_TYPE === 's3' && env.S3_ENDPOINT && env.S3_BUCKET) {
    logger.info({ type: 's3', endpoint: env.S3_ENDPOINT }, 'Using S3 storage');
    return new S3StorageProvider({
      endpoint: env.S3_ENDPOINT,
      bucket: env.S3_BUCKET,
      accessKey: env.S3_ACCESS_KEY ?? '',
      secretKey: env.S3_SECRET_KEY ?? '',
      region: env.S3_REGION,
    });
  }

  logger.info({ type: 'local', path: env.STORAGE_PATH }, 'Using local storage');
  return new LocalStorageProvider({
    basePath: env.STORAGE_PATH,
  });
}

// Re-export types
export * from './types.js';
