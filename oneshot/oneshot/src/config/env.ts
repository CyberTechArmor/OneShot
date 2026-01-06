import { z } from 'zod';

/**
 * Environment variable schema with validation.
 * All required variables must be set; optional ones have defaults.
 */
const envSchema = z.object({
  // Server
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(5090),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),

  // Database
  DATABASE_URL: z.string().url(),

  // Authentication
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRY: z.string().default('15m'),
  REFRESH_TOKEN_EXPIRY_DAYS: z.coerce.number().default(7),
  MAGIC_LINK_EXPIRY_MINUTES: z.coerce.number().default(15),

  // CORS
  CORS_ORIGIN: z.string().default('http://localhost:5173'),

  // AI Vendors
  ANTHROPIC_API_KEY: z.string().optional(),
  ANTHROPIC_MODEL: z.string().default('claude-opus-4-5-20250514'),
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_MODEL: z.string().default('gpt-4o'),

  // Voice (ElevenLabs)
  ELEVENLABS_API_KEY: z.string().optional(),
  ELEVENLABS_VOICE_ID: z.string().optional(),

  // SMTP (Magic Links)
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  SMTP_FROM: z.string().email().optional(),

  // Storage
  STORAGE_TYPE: z.enum(['local', 's3']).default('local'),
  STORAGE_PATH: z.string().default('./uploads'),
  S3_ENDPOINT: z.string().optional(),
  S3_BUCKET: z.string().optional(),
  S3_ACCESS_KEY: z.string().optional(),
  S3_SECRET_KEY: z.string().optional(),
  S3_REGION: z.string().default('us-east-1'),

  // Proxy
  PROXY_ENABLED: z.coerce.boolean().default(true),
  PROXY_DOMAIN: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Validated environment configuration.
 * Throws on startup if required variables are missing.
 */
function loadEnv(): Env {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error('❌ Invalid environment variables:');
    console.error(result.error.flatten().fieldErrors);
    process.exit(1);
  }

  return result.data;
}

export const env = loadEnv();

/**
 * Check if AI vendor is configured.
 */
export function isAiVendorConfigured(vendor: 'anthropic' | 'openai'): boolean {
  if (vendor === 'anthropic') {
    return Boolean(env.ANTHROPIC_API_KEY);
  }
  return Boolean(env.OPENAI_API_KEY);
}

/**
 * Check if voice is configured.
 */
export function isVoiceConfigured(): boolean {
  return Boolean(env.ELEVENLABS_API_KEY && env.ELEVENLABS_VOICE_ID);
}

/**
 * Check if SMTP is configured for magic links.
 */
export function isSmtpConfigured(): boolean {
  return Boolean(env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASSWORD && env.SMTP_FROM);
}
