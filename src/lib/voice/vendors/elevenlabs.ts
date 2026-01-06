/**
 * ElevenLabs Voice Vendor Implementation
 * ARCH-002: Voice vendor abstraction layer.
 * 
 * This is the only file that imports ElevenLabs API directly.
 */

import type {
  VoiceVendor,
  VoiceVendorConfig,
  TranscriptResult,
  SpeechOptions,
} from '../types.js';
import { logger } from '../../logger.js';

/**
 * ElevenLabs API voice format.
 */
interface ElevenLabsVoice {
  voice_id: string;
  name: string;
  category: string;
}

/**
 * ElevenLabs STT response format.
 */
interface ElevenLabsTranscript {
  text: string;
  language_code?: string;
  language_probability?: number;
  words?: Array<{
    word: string;
    start: number;
    end: number;
  }>;
}

/**
 * ElevenLabs vendor implementation.
 */
export class ElevenLabsVendor implements VoiceVendor {
  readonly name = 'elevenlabs';
  private readonly config: VoiceVendorConfig;
  private readonly baseUrl = 'https://api.elevenlabs.io/v1';

  constructor(config: VoiceVendorConfig) {
    this.config = config;
  }

  isAvailable(): boolean {
    return Boolean(this.config.apiKey);
  }

  async transcribe(audio: Buffer, mimeType: string): Promise<TranscriptResult> {
    const formData = new FormData();
    formData.append('audio', new Blob([audio], { type: mimeType }), 'audio');
    formData.append('model_id', 'scribe_v1');

    const startTime = Date.now();

    const response = await fetch(`${this.baseUrl}/speech-to-text`, {
      method: 'POST',
      headers: {
        'xi-api-key': this.config.apiKey,
      },
      body: formData,
    });

    const latency = Date.now() - startTime;
    logger.debug({ latency }, 'ElevenLabs STT latency');

    if (!response.ok) {
      const error = await response.text();
      logger.error({ status: response.status, error }, 'ElevenLabs STT error');
      throw new Error(`ElevenLabs STT error: ${response.status}`);
    }

    const result = (await response.json()) as ElevenLabsTranscript;

    return {
      text: result.text,
      language: result.language_code,
      confidence: result.language_probability,
      words: result.words,
    };
  }

  async synthesize(options: SpeechOptions): Promise<Buffer> {
    const startTime = Date.now();

    const response = await fetch(
      `${this.baseUrl}/text-to-speech/${options.voiceId}?output_format=mp3_44100_128`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': this.config.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: options.text,
          model_id: 'eleven_turbo_v2_5',
          voice_settings: {
            stability: options.stability ?? 0.5,
            similarity_boost: options.similarityBoost ?? 0.75,
          },
        }),
      }
    );

    const latency = Date.now() - startTime;
    logger.debug({ latency }, 'ElevenLabs TTS latency');

    if (!response.ok) {
      const error = await response.text();
      logger.error({ status: response.status, error }, 'ElevenLabs TTS error');
      throw new Error(`ElevenLabs TTS error: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  async streamSynthesize(
    options: SpeechOptions,
    onChunk: (chunk: Buffer) => void
  ): Promise<void> {
    const startTime = Date.now();

    const response = await fetch(
      `${this.baseUrl}/text-to-speech/${options.voiceId}/stream?output_format=mp3_44100_128`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': this.config.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: options.text,
          model_id: 'eleven_turbo_v2_5',
          voice_settings: {
            stability: options.stability ?? 0.5,
            similarity_boost: options.similarityBoost ?? 0.75,
          },
        }),
      }
    );

    const latency = Date.now() - startTime;
    logger.debug({ latency }, 'ElevenLabs TTS stream first byte latency');

    if (!response.ok) {
      const error = await response.text();
      logger.error({ status: response.status, error }, 'ElevenLabs TTS stream error');
      throw new Error(`ElevenLabs TTS stream error: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        onChunk(Buffer.from(value));
      }
    } finally {
      reader.releaseLock();
    }
  }

  async listVoices(): Promise<Array<{ id: string; name: string; category?: string }>> {
    const response = await fetch(`${this.baseUrl}/voices`, {
      headers: {
        'xi-api-key': this.config.apiKey,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      logger.error({ status: response.status, error }, 'ElevenLabs list voices error');
      throw new Error(`ElevenLabs list voices error: ${response.status}`);
    }

    const result = (await response.json()) as { voices: ElevenLabsVoice[] };

    return result.voices.map((v) => ({
      id: v.voice_id,
      name: v.name,
      category: v.category,
    }));
  }
}
