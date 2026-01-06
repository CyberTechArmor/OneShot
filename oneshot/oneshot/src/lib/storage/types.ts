/**
 * Storage Abstraction Layer
 * ARCH-003: File storage via interface supporting local and S3.
 */

/**
 * Storage object metadata.
 */
export interface StorageObject {
  key: string;
  size: number;
  contentType: string;
  lastModified: Date;
}

/**
 * Storage provider interface.
 * All storage providers must implement this interface.
 */
export interface StorageProvider {
  /** Provider identifier */
  readonly name: 'local' | 's3';

  /**
   * Check if provider is configured and available.
   */
  isAvailable(): boolean;

  /**
   * Upload a file.
   */
  upload(key: string, data: Buffer, contentType: string): Promise<void>;

  /**
   * Download a file.
   */
  download(key: string): Promise<Buffer>;

  /**
   * Delete a file.
   */
  delete(key: string): Promise<void>;

  /**
   * Check if a file exists.
   */
  exists(key: string): Promise<boolean>;

  /**
   * Get file metadata.
   */
  getMetadata(key: string): Promise<StorageObject | null>;

  /**
   * List files with optional prefix.
   */
  list(prefix?: string): Promise<StorageObject[]>;

  /**
   * Get a signed URL for temporary access (S3 only).
   */
  getSignedUrl?(key: string, expiresIn: number): Promise<string>;
}

/**
 * Local storage configuration.
 */
export interface LocalStorageConfig {
  basePath: string;
}

/**
 * S3 storage configuration.
 */
export interface S3StorageConfig {
  endpoint: string;
  bucket: string;
  accessKey: string;
  secretKey: string;
  region: string;
}
