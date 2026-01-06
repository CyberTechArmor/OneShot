import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '../config/env.js';
import * as schema from './schema.js';

/**
 * PostgreSQL connection.
 * ARCH-004: All database access through Drizzle ORM.
 */
const client = postgres(env.DATABASE_URL, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

/**
 * Drizzle ORM instance with schema.
 */
export const db = drizzle(client, { schema });

/**
 * Health check for database connection.
 */
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await client`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

/**
 * Graceful shutdown.
 */
export async function closeDatabaseConnection(): Promise<void> {
  await client.end();
}
