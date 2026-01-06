/**
 * S3-Compatible Storage Provider
 * ARCH-003: Storage abstraction layer.
 * 
 * Supports AWS S3, MinIO, and other S3-compatible services.
 * 
 * Implementation requires @aws-sdk/client-s3 package.
 * This is a placeholder that will be implemented when S3 is configured.
 */

import type { StorageProvider, StorageObject, S3StorageConfig } from '../types.js';
import { logger } from '../../logger.js';

/**
 * S3-compatible storage provider.
 * 
 * Note: This requires the @aws-sdk/client-s3 package to be installed.
 * Only install if S3 storage is needed to minimize dependencies.
 * 
 * ```bash
 * npm install @aws-sdk/client-s3
 * ```
 */
export class S3StorageProvider implements StorageProvider {
  readonly name = 's3' as const;
  private readonly config: S3StorageConfig;

  constructor(config: S3StorageConfig) {
    this.config = config;
    logger.info({ endpoint: config.endpoint, bucket: config.bucket }, 'S3 storage configured');
  }

  isAvailable(): boolean {
    return Boolean(
      this.config.endpoint &&
      this.config.bucket &&
      this.config.accessKey &&
      this.config.secretKey
    );
  }

  upload(_key: string, _data: Buffer, _contentType: string): Promise<void> {
    // TODO: Implement with @aws-sdk/client-s3
    return Promise.reject(new Error('S3 storage not implemented. Install @aws-sdk/client-s3 and implement.'));
  }

  download(_key: string): Promise<Buffer> {
    return Promise.reject(new Error('S3 storage not implemented'));
  }

  delete(_key: string): Promise<void> {
    return Promise.reject(new Error('S3 storage not implemented'));
  }

  exists(_key: string): Promise<boolean> {
    return Promise.reject(new Error('S3 storage not implemented'));
  }

  getMetadata(_key: string): Promise<StorageObject | null> {
    return Promise.reject(new Error('S3 storage not implemented'));
  }

  list(_prefix?: string): Promise<StorageObject[]> {
    return Promise.reject(new Error('S3 storage not implemented'));
  }

  getSignedUrl(_key: string, _expiresIn: number): Promise<string> {
    return Promise.reject(new Error('S3 storage not implemented'));
  }
}
