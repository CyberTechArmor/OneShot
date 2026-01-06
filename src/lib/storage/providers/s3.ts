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

  async upload(_key: string, _data: Buffer, _contentType: string): Promise<void> {
    // TODO: Implement with @aws-sdk/client-s3
    throw new Error('S3 storage not implemented. Install @aws-sdk/client-s3 and implement.');
  }

  async download(_key: string): Promise<Buffer> {
    throw new Error('S3 storage not implemented');
  }

  async delete(_key: string): Promise<void> {
    throw new Error('S3 storage not implemented');
  }

  async exists(_key: string): Promise<boolean> {
    throw new Error('S3 storage not implemented');
  }

  async getMetadata(_key: string): Promise<StorageObject | null> {
    throw new Error('S3 storage not implemented');
  }

  async list(_prefix?: string): Promise<StorageObject[]> {
    throw new Error('S3 storage not implemented');
  }

  async getSignedUrl(_key: string, _expiresIn: number): Promise<string> {
    throw new Error('S3 storage not implemented');
  }
}
