/**
 * AI Vendor Abstraction Layer
 * ARCH-001: AI calls go through vendor-agnostic interface.
 * 
 * This interface enables switching between Claude, OpenAI, and local models
 * without changing application code.
 */

/**
 * Message role in conversation.
 */
export type MessageRole = 'user' | 'assistant' | 'system';

/**
 * A message in a conversation.
 */
export interface Message {
  role: MessageRole;
  content: string;
}

/**
 * Request to generate a completion.
 */
export interface CompletionRequest {
  /** System prompt for the conversation */
  systemPrompt?: string;
  /** Conversation messages */
  messages: Message[];
  /** Maximum tokens in response */
  maxTokens?: number;
  /** Temperature for randomness (0-1) */
  temperature?: number;
  /** Enable streaming response */
  stream?: boolean;
}

/**
 * Token usage from a completion.
 * DATA-003: Token usage tracked for all AI calls.
 */
export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  /** Cached tokens (Anthropic prompt caching) */
  cachedTokens?: number;
}

/**
 * Response from a completion.
 */
export interface CompletionResponse {
  /** Generated text */
  text: string;
  /** Reason generation stopped */
  finishReason: 'end_turn' | 'max_tokens' | 'stop_sequence' | 'error';
  /** Token usage for tracking */
  usage: TokenUsage;
  /** Model used */
  model: string;
}

/**
 * Streaming chunk from a completion.
 */
export interface StreamChunk {
  /** Incremental text content */
  text: string;
  /** Whether this is the final chunk */
  done: boolean;
  /** Token usage (only in final chunk) */
  usage?: TokenUsage;
}

/**
 * AI vendor interface.
 * All AI vendors must implement this interface.
 */
export interface AiVendor {
  /** Vendor identifier */
  readonly name: 'anthropic' | 'openai' | 'local';

  /**
   * Check if the vendor is configured and available.
   */
  isAvailable(): boolean;

  /**
   * Generate a completion (non-streaming).
   */
  complete(request: CompletionRequest): Promise<CompletionResponse>;

  /**
   * Generate a streaming completion.
   */
  stream(
    request: CompletionRequest,
    onChunk: (chunk: StreamChunk) => void
  ): Promise<CompletionResponse>;

  /**
   * Estimate token count for a message (optional optimization).
   */
  estimateTokens?(text: string): number;
}

/**
 * AI vendor configuration.
 */
export interface AiVendorConfig {
  apiKey: string;
  model: string;
  baseUrl?: string;
}
