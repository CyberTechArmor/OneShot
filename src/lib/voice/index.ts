/**
 * Voice Vendor Manager
 * ARCH-002: Voice calls go through vendor-agnostic interface.
 */

import type { VoiceVendor, VoiceVendorConfig } from './types.js';
import { ElevenLabsVendor } from './vendors/elevenlabs.js';
import { env } from '../../config/env.js';
import { logger } from '../logger.js';

export type VoiceVendorType = 'elevenlabs';

/**
 * Create a voice vendor instance.
 */
export function createVoiceVendor(
  type: VoiceVendorType,
  config?: Partial<VoiceVendorConfig>
): VoiceVendor {
  switch (type) {
    case 'elevenlabs':
      return new ElevenLabsVendor({
        apiKey: config?.apiKey ?? env.ELEVENLABS_API_KEY ?? '',
        defaultVoiceId: config?.defaultVoiceId ?? env.ELEVENLABS_VOICE_ID,
      });

    default:
      throw new Error(`Unknown voice vendor: ${type as string}`);
  }
}

/**
 * Get the default voice vendor based on configuration.
 */
export function getDefaultVoiceVendor(): VoiceVendor | null {
  if (env.ELEVENLABS_API_KEY) {
    logger.info({ vendor: 'elevenlabs' }, 'Using ElevenLabs for voice');
    return createVoiceVendor('elevenlabs');
  }

  logger.warn('No voice vendor configured. Voice features disabled.');
  return null;
}

/**
 * Check if voice is available.
 */
export function isVoiceAvailable(): boolean {
  return Boolean(env.ELEVENLABS_API_KEY && env.ELEVENLABS_VOICE_ID);
}

// Re-export types
export * from './types.js';
