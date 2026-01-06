/**
 * Test Setup
 * Global configuration for Vitest tests.
 */

import { beforeAll, afterAll } from 'vitest';

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key-minimum-32-characters';
process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/oneshot_test';

beforeAll(() => {
  // Global test setup
});

afterAll(() => {
  // Global test cleanup
});
