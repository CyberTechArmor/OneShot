/**
 * OpenAI GPT Vendor Implementation
 * ARCH-001: AI vendor abstraction layer.
 * 
 * This is the only file that imports the OpenAI SDK directly.
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
 * OpenAI API message format.
 */
interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * OpenAI API response format.
 */
interface OpenAIResponse {
  id: string;
  object: 'chat.completion';
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: 'assistant';
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * OpenAI GPT vendor.
 */
export class OpenAIVendor implements AiVendor {
  readonly name = 'openai' as const;
  private readonly config: AiVendorConfig;
  private readonly baseUrl: string;

  constructor(config: AiVendorConfig) {
    this.config = config;
    this.baseUrl = config.baseUrl ?? 'https://api.openai.com/v1';
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
  ): Promise<OpenAIResponse> {
    const messages = this.convertMessages(request.messages, request.systemPrompt);

    const body = {
      model: this.config.model,
      max_tokens: request.maxTokens ?? 4096,
      temperature: request.temperature ?? 0.7,
      stream,
      messages,
    };

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      logger.error({ status: response.status, error }, 'OpenAI API error');
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    return response.json() as Promise<OpenAIResponse>;
  }

  private async makeStreamingRequest(
    request: CompletionRequest,
    onChunk: (chunk: StreamChunk) => void
  ): Promise<CompletionResponse> {
    const messages = this.convertMessages(request.messages, request.systemPrompt);

    const body = {
      model: this.config.model,
      max_tokens: request.maxTokens ?? 4096,
      temperature: request.temperature ?? 0.7,
      stream: true,
      stream_options: { include_usage: true },
      messages,
    };

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      logger.error({ status: response.status, error }, 'OpenAI API error');
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    // Parse SSE stream
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    const decoder = new TextDecoder();
    let fullText = '';
    let usage = { inputTokens: 0, outputTokens: 0 };
    let finishReason: CompletionResponse['finishReason'] = 'end_turn';

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
                choices?: Array<{
                  delta?: { content?: string };
                  finish_reason?: string;
                }>;
                usage?: {
                  prompt_tokens: number;
                  completion_tokens: number;
                };
              };

              const delta = event.choices?.[0]?.delta;
              if (delta?.content) {
                fullText += delta.content;
                onChunk({ text: delta.content, done: false });
              }

              if (event.choices?.[0]?.finish_reason) {
                finishReason = this.mapFinishReason(event.choices[0].finish_reason);
              }

              if (event.usage) {
                usage = {
                  inputTokens: event.usage.prompt_tokens,
                  outputTokens: event.usage.completion_tokens,
                };
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

  private convertMessages(messages: Message[], systemPrompt?: string): OpenAIMessage[] {
    const result: OpenAIMessage[] = [];

    // OpenAI includes system prompt in messages array
    if (systemPrompt) {
      result.push({ role: 'system', content: systemPrompt });
    }

    for (const m of messages) {
      if (m.role === 'system') {
        result.push({ role: 'system', content: m.content });
      } else {
        result.push({
          role: m.role,
          content: m.content,
        });
      }
    }

    return result;
  }

  private parseResponse(response: OpenAIResponse): CompletionResponse {
    const choice = response.choices[0];
    if (!choice) {
      throw new Error('No completion choice returned');
    }

    return {
      text: choice.message.content,
      finishReason: this.mapFinishReason(choice.finish_reason),
      usage: {
        inputTokens: response.usage.prompt_tokens,
        outputTokens: response.usage.completion_tokens,
      },
      model: response.model,
    };
  }

  private mapFinishReason(reason: string): CompletionResponse['finishReason'] {
    switch (reason) {
      case 'stop':
        return 'end_turn';
      case 'length':
        return 'max_tokens';
      default:
        return 'error';
    }
  }
}
