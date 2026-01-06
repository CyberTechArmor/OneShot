/**
 * Anthropic Claude Vendor Implementation
 * ARCH-001: AI vendor abstraction layer.
 * 
 * This is the only file that imports the Anthropic SDK directly.
 */

import type {
  AiVendor,
  AiVendorConfig,
  CompletionRequest,
  CompletionResponse,
  StreamChunk,
  Message,
} from '../types.js';
import { logger } from '../../logger.js';

/**
 * Anthropic API message format.
 */
interface AnthropicMessage {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Anthropic API response format.
 */
interface AnthropicResponse {
  id: string;
  type: 'message';
  role: 'assistant';
  content: Array<{ type: 'text'; text: string }>;
  model: string;
  stop_reason: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
    cache_creation_input_tokens?: number;
    cache_read_input_tokens?: number;
  };
}

/**
 * Anthropic Claude vendor.
 */
export class AnthropicVendor implements AiVendor {
  readonly name = 'anthropic' as const;
  private readonly config: AiVendorConfig;
  private readonly baseUrl = 'https://api.anthropic.com';
  private readonly apiVersion = '2024-01-01';

  constructor(config: AiVendorConfig) {
    this.config = config;
  }

  isAvailable(): boolean {
    return Boolean(this.config.apiKey);
  }

  async complete(request: CompletionRequest): Promise<CompletionResponse> {
    const response = await this.makeRequest(request, false);
    return this.parseResponse(response);
  }

  async stream(
    request: CompletionRequest,
    onChunk: (chunk: StreamChunk) => void
  ): Promise<CompletionResponse> {
    const response = await this.makeStreamingRequest(request, onChunk);
    return response;
  }

  private async makeRequest(
    request: CompletionRequest,
    stream: boolean
  ): Promise<AnthropicResponse> {
    const messages = this.convertMessages(request.messages);

    const body = {
      model: this.config.model,
      max_tokens: request.maxTokens ?? 4096,
      temperature: request.temperature ?? 0.7,
      stream,
      ...(request.systemPrompt && { system: request.systemPrompt }),
      messages,
    };

    const response = await fetch(`${this.baseUrl}/v1/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.config.apiKey,
        'anthropic-version': this.apiVersion,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      logger.error({ status: response.status, error }, 'Anthropic API error');
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    return response.json() as Promise<AnthropicResponse>;
  }

  private async makeStreamingRequest(
    request: CompletionRequest,
    onChunk: (chunk: StreamChunk) => void
  ): Promise<CompletionResponse> {
    const messages = this.convertMessages(request.messages);

    const body = {
      model: this.config.model,
      max_tokens: request.maxTokens ?? 4096,
      temperature: request.temperature ?? 0.7,
      stream: true,
      ...(request.systemPrompt && { system: request.systemPrompt }),
      messages,
    };

    const response = await fetch(`${this.baseUrl}/v1/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.config.apiKey,
        'anthropic-version': this.apiVersion,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      logger.error({ status: response.status, error }, 'Anthropic API error');
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    // Parse SSE stream
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    const decoder = new TextDecoder();
    let fullText = '';
    let usage = { inputTokens: 0, outputTokens: 0 };
    const finishReason: CompletionResponse['finishReason'] = 'end_turn';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const event = JSON.parse(data) as {
                type: string;
                delta?: { type: string; text?: string };
                usage?: { input_tokens: number; output_tokens: number };
                message?: { usage: { input_tokens: number; output_tokens: number } };
              };

              if (event.type === 'content_block_delta' && event.delta?.text) {
                fullText += event.delta.text;
                onChunk({ text: event.delta.text, done: false });
              }

              if (event.type === 'message_delta' && event.usage) {
                usage = {
                  inputTokens: event.usage.input_tokens,
                  outputTokens: event.usage.output_tokens,
                };
              }

              if (event.type === 'message_start' && event.message?.usage) {
                usage.inputTokens = event.message.usage.input_tokens;
              }
            } catch {
              // Skip malformed JSON
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }

    onChunk({ text: '', done: true, usage });

    return {
      text: fullText,
      finishReason,
      usage,
      model: this.config.model,
    };
  }

  private convertMessages(messages: Message[]): AnthropicMessage[] {
    return messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }));
  }

  private parseResponse(response: AnthropicResponse): CompletionResponse {
    const text = response.content
      .filter((c) => c.type === 'text')
      .map((c) => c.text)
      .join('');

    const finishReason = this.mapFinishReason(response.stop_reason);

    return {
      text,
      finishReason,
      usage: {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
        cachedTokens: response.usage.cache_read_input_tokens,
      },
      model: response.model,
    };
  }

  private mapFinishReason(reason: string): CompletionResponse['finishReason'] {
    switch (reason) {
      case 'end_turn':
        return 'end_turn';
      case 'max_tokens':
        return 'max_tokens';
      case 'stop_sequence':
        return 'stop_sequence';
      default:
        return 'error';
    }
  }
}
