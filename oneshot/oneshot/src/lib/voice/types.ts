/**
 * Voice Vendor Abstraction Layer
 * ARCH-002: Voice calls go through vendor-agnostic interface.
 * 
 * This interface enables switching voice vendors if ElevenLabs issues arise.
 */

/**
 * Speech-to-text result.
 */
export interface TranscriptResult {
  /** Transcribed text */
  text: string;
  /** Detected language code */
  language?: string;
  /** Confidence score (0-1) */
  confidence?: number;
  /** Word-level timestamps */
  words?: Array<{
    word: string;
    start: number;
    end: number;
  }>;
}

/**
 * Text-to-speech options.
 */
export interface SpeechOptions {
  /** Text to synthesize */
  text: string;
  /** Voice ID */
  voiceId: string;
  /** Output format */
  format?: 'mp3' | 'wav' | 'pcm';
  /** Voice stability (0-1) */
  stability?: number;
  /** Voice similarity boost (0-1) */
  similarityBoost?: number;
}

/**
 * Voice vendor interface.
 * All voice vendors must implement this interface.
 */
export interface VoiceVendor {
  /** Vendor identifier */
  readonly name: string;

  /**
   * Check if the vendor is configured and available.
   */
  isAvailable(): boolean;

  /**
   * Transcribe audio to text (STT).
   * DATA-004: Transcript must be persisted immediately.
   */
  transcribe(audio: Buffer, mimeType: string): Promise<TranscriptResult>;

  /**
   * Synthesize text to speech audio (TTS).
   */
  synthesize(options: SpeechOptions): Promise<Buffer>;

  /**
   * Stream synthesized audio for lower latency.
   */
  streamSynthesize(
    options: SpeechOptions,
    onChunk: (chunk: Buffer) => void
  ): Promise<void>;

  /**
   * List available voices.
   */
  listVoices(): Promise<Array<{ id: string; name: string; category?: string }>>;
}

/**
 * Voice vendor configuration.
 */
export interface VoiceVendorConfig {
  apiKey: string;
  defaultVoiceId?: string;
}
