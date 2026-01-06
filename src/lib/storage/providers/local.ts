/**
 * Local Filesystem Storage Provider
 * ARCH-003: Storage abstraction layer.
 */

import fs from 'fs/promises';
import path from 'path';
import type { StorageProvider, StorageObject, LocalStorageConfig } from '../types.js';
import { logger } from '../../logger.js';

/**
 * Local filesystem storage provider.
 */
export class LocalStorageProvider implements StorageProvider {
  readonly name = 'local' as const;
  private readonly basePath: string;

  constructor(config: LocalStorageConfig) {
    this.basePath = path.resolve(config.basePath);
  }

  isAvailable(): boolean {
    return true;
  }

  async upload(key: string, data: Buffer, _contentType: string): Promise<void> {
    const filePath = this.getFilePath(key);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, data);
    logger.debug({ key, size: data.length }, 'File uploaded');
  }

  async download(key: string): Promise<Buffer> {
    const filePath = this.getFilePath(key);
    return fs.readFile(filePath);
  }

  async delete(key: string): Promise<void> {
    const filePath = this.getFilePath(key);
    try {
      await fs.unlink(filePath);
      logger.debug({ key }, 'File deleted');
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw error;
      }
    }
  }

  async exists(key: string): Promise<boolean> {
    const filePath = this.getFilePath(key);
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async getMetadata(key: string): Promise<StorageObject | null> {
    const filePath = this.getFilePath(key);
    try {
      const stats = await fs.stat(filePath);
      return {
        key,
        size: stats.size,
        contentType: this.guessContentType(key),
        lastModified: stats.mtime,
      };
    } catch {
      return null;
    }
  }

  async list(prefix?: string): Promise<StorageObject[]> {
    const searchPath = prefix
      ? path.join(this.basePath, prefix)
      : this.basePath;

    try {
      const files = await this.walkDirectory(searchPath);
      return await Promise.all(
        files.map(async (filePath) => {
          const key = path.relative(this.basePath, filePath);
          const stats = await fs.stat(filePath);
          return {
            key,
            size: stats.size,
            contentType: this.guessContentType(key),
            lastModified: stats.mtime,
          };
        })
      );
    } catch {
      return [];
    }
  }

  private getFilePath(key: string): string {
    // Prevent path traversal attacks
    const normalizedKey = path.normalize(key).replace(/^(\.\.(\/|\\|$))+/, '');
    return path.join(this.basePath, normalizedKey);
  }

  private async walkDirectory(dir: string): Promise<string[]> {
    const files: string[] = [];
    
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          files.push(...(await this.walkDirectory(fullPath)));
        } else {
          files.push(fullPath);
        }
      }
    } catch {
      // Directory doesn't exist or not accessible
    }

    return files;
  }

  private guessContentType(key: string): string {
    const ext = path.extname(key).toLowerCase();
    const types: Record<string, string> = {
      '.md': 'text/markdown',
      '.json': 'application/json',
      '.yaml': 'application/yaml',
      '.yml': 'application/yaml',
      '.pdf': 'application/pdf',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.txt': 'text/plain',
      '.html': 'text/html',
      '.mp3': 'audio/mpeg',
      '.wav': 'audio/wav',
    };
    return types[ext] ?? 'application/octet-stream';
  }
}
