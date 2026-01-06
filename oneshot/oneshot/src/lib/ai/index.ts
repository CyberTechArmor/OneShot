/**
 * AI Vendor Manager
 * ARCH-001: AI calls go through vendor-agnostic interface.
 * 
 * Provides factory for creating vendors and managing active vendor.
 */

import type { AiVendor, AiVendorConfig } from './types.js';
import { AnthropicVendor } from './vendors/anthropic.js';
import { OpenAIVendor } from './vendors/openai.js';
import { env } from '../config/env.js';
import { logger } from './logger.js';

export type VendorType = 'anthropic' | 'openai' | 'local';

/**
 * Create an AI vendor instance.
 */
export function createVendor(type: VendorType, config?: Partial<AiVendorConfig>): AiVendor {
  switch (type) {
    case 'anthropic':
      return new AnthropicVendor({
        apiKey: config?.apiKey ?? env.ANTHROPIC_API_KEY ?? '',
        model: config?.model ?? env.ANTHROPIC_MODEL,
      });

    case 'openai':
      return new OpenAIVendor({
        apiKey: config?.apiKey ?? env.OPENAI_API_KEY ?? '',
        model: config?.model ?? env.OPENAI_MODEL,
        baseUrl: config?.baseUrl,
      });

    case 'local':
      // Local models use OpenAI-compatible API
      return new OpenAIVendor({
        apiKey: config?.apiKey ?? 'not-needed',
        model: config?.model ?? 'local',
        baseUrl: config?.baseUrl ?? 'http://localhost:11434/v1',
      });

    default:
      throw new Error(`Unknown AI vendor: ${type}`);
  }
}

/**
 * Get the default vendor based on configuration.
 */
export function getDefaultVendor(): AiVendor {
  // Try Anthropic first (recommended)
  if (env.ANTHROPIC_API_KEY) {
    logger.info({ vendor: 'anthropic', model: env.ANTHROPIC_MODEL }, 'Using Anthropic');
    return createVendor('anthropic');
  }

  // Fall back to OpenAI
  if (env.OPENAI_API_KEY) {
    logger.info({ vendor: 'openai', model: env.OPENAI_MODEL }, 'Using OpenAI');
    return createVendor('openai');
  }

  throw new Error('No AI vendor configured. Set ANTHROPIC_API_KEY or OPENAI_API_KEY.');
}

/**
 * Check which vendors are available.
 */
export function getAvailableVendors(): VendorType[] {
  const available: VendorType[] = [];

  if (env.ANTHROPIC_API_KEY) {
    available.push('anthropic');
  }

  if (env.OPENAI_API_KEY) {
    available.push('openai');
  }

  return available;
}

// Re-export types
export * from './types.js';
