/**
 * Simple migration script that creates the database schema
 * This runs at container startup to ensure tables exist
 */

import postgres from 'postgres';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL environment variable is required');
  process.exit(1);
}

const sql = postgres(DATABASE_URL, {
  max: 1,
  idle_timeout: 5,
});

async function migrate() {
  console.log('==> Running database migrations...');

  try {
    // Create enums if they don't exist
    await sql.unsafe(`
      DO $$ BEGIN
        CREATE TYPE user_role AS ENUM ('user', 'admin', 'super_admin');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      DO $$ BEGIN
        CREATE TYPE project_status AS ENUM ('active', 'archived', 'completed');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      DO $$ BEGIN
        CREATE TYPE cid_phase AS ENUM ('discovery', 'design', 'stack', 'build');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      DO $$ BEGIN
        CREATE TYPE message_sender AS ENUM ('user', 'assistant', 'system');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      DO $$ BEGIN
        CREATE TYPE message_input_type AS ENUM ('text', 'voice');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      DO $$ BEGIN
        CREATE TYPE document_type AS ENUM ('discovery_output', 'design_output', 'stack_output', 'build_prompt', 'custom');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      DO $$ BEGIN
        CREATE TYPE ai_vendor AS ENUM ('anthropic', 'openai', 'local');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
    console.log('  - Enums created');

    // Create users table
    await sql.unsafe(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT NOT NULL UNIQUE,
        name TEXT,
        password_hash TEXT,
        role user_role NOT NULL DEFAULT 'user',
        email_verified BOOLEAN NOT NULL DEFAULT false,
        last_login_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        deleted_at TIMESTAMPTZ
      );
      CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);
    `);
    console.log('  - Users table created');

    // Create magic_links table
    await sql.unsafe(`
      CREATE TABLE IF NOT EXISTS magic_links (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token TEXT NOT NULL UNIQUE,
        expires_at TIMESTAMPTZ NOT NULL,
        used_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
      CREATE INDEX IF NOT EXISTS magic_links_token_idx ON magic_links(token);
      CREATE INDEX IF NOT EXISTS magic_links_user_id_idx ON magic_links(user_id);
    `);
    console.log('  - Magic links table created');

    // Create refresh_tokens table
    await sql.unsafe(`
      CREATE TABLE IF NOT EXISTS refresh_tokens (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token_hash TEXT NOT NULL UNIQUE,
        expires_at TIMESTAMPTZ NOT NULL,
        revoked_at TIMESTAMPTZ,
        device_info TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
      CREATE INDEX IF NOT EXISTS refresh_tokens_token_hash_idx ON refresh_tokens(token_hash);
      CREATE INDEX IF NOT EXISTS refresh_tokens_user_id_idx ON refresh_tokens(user_id);
    `);
    console.log('  - Refresh tokens table created');

    // Create projects table
    await sql.unsafe(`
      CREATE TABLE IF NOT EXISTS projects (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        description TEXT,
        status project_status NOT NULL DEFAULT 'active',
        current_phase cid_phase NOT NULL DEFAULT 'discovery',
        total_tokens_used INTEGER NOT NULL DEFAULT 0,
        livekit_room_name TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        deleted_at TIMESTAMPTZ
      );
      CREATE INDEX IF NOT EXISTS projects_owner_id_idx ON projects(owner_id);
      CREATE INDEX IF NOT EXISTS projects_status_idx ON projects(status);
    `);
    console.log('  - Projects table created');

    // Create project_members table
    await sql.unsafe(`
      CREATE TABLE IF NOT EXISTS project_members (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        role TEXT NOT NULL DEFAULT 'member',
        invited_at TIMESTAMPTZ,
        accepted_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
      CREATE INDEX IF NOT EXISTS project_members_project_user_idx ON project_members(project_id, user_id);
    `);
    console.log('  - Project members table created');

    // Create conversations table
    await sql.unsafe(`
      CREATE TABLE IF NOT EXISTS conversations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        phase cid_phase NOT NULL,
        title TEXT,
        tokens_used INTEGER NOT NULL DEFAULT 0,
        is_active BOOLEAN NOT NULL DEFAULT true,
        livekit_session_id TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        deleted_at TIMESTAMPTZ
      );
      CREATE INDEX IF NOT EXISTS conversations_project_id_idx ON conversations(project_id);
      CREATE INDEX IF NOT EXISTS conversations_phase_idx ON conversations(phase);
    `);
    console.log('  - Conversations table created');

    // Create messages table
    await sql.unsafe(`
      CREATE TABLE IF NOT EXISTS messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
        sender message_sender NOT NULL,
        input_type message_input_type NOT NULL DEFAULT 'text',
        content TEXT NOT NULL,
        tokens_used INTEGER,
        voice_metadata JSONB,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
      CREATE INDEX IF NOT EXISTS messages_conversation_id_idx ON messages(conversation_id);
      CREATE INDEX IF NOT EXISTS messages_created_at_idx ON messages(created_at);
    `);
    console.log('  - Messages table created');

    // Create token_usage table
    await sql.unsafe(`
      CREATE TABLE IF NOT EXISTS token_usage (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
        vendor ai_vendor NOT NULL,
        model TEXT NOT NULL,
        input_tokens INTEGER NOT NULL,
        output_tokens INTEGER NOT NULL,
        estimated_cost_usd INTEGER,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
      CREATE INDEX IF NOT EXISTS token_usage_conversation_id_idx ON token_usage(conversation_id);
      CREATE INDEX IF NOT EXISTS token_usage_vendor_idx ON token_usage(vendor);
    `);
    console.log('  - Token usage table created');

    // Create documents table
    await sql.unsafe(`
      CREATE TABLE IF NOT EXISTS documents (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        type document_type NOT NULL,
        phase cid_phase NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        format TEXT NOT NULL DEFAULT 'markdown',
        is_locked BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        deleted_at TIMESTAMPTZ
      );
      CREATE INDEX IF NOT EXISTS documents_project_id_idx ON documents(project_id);
      CREATE INDEX IF NOT EXISTS documents_type_idx ON documents(type);
      CREATE INDEX IF NOT EXISTS documents_phase_idx ON documents(phase);
    `);
    console.log('  - Documents table created');

    // Create document_versions table
    await sql.unsafe(`
      CREATE TABLE IF NOT EXISTS document_versions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
        version INTEGER NOT NULL,
        content TEXT NOT NULL,
        change_note TEXT,
        edited_by UUID REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
      CREATE INDEX IF NOT EXISTS document_versions_document_id_idx ON document_versions(document_id);
      CREATE INDEX IF NOT EXISTS document_versions_version_idx ON document_versions(document_id, version);
    `);
    console.log('  - Document versions table created');

    // Create system_settings table
    await sql.unsafe(`
      CREATE TABLE IF NOT EXISTS system_settings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        key TEXT NOT NULL UNIQUE,
        value JSONB NOT NULL,
        description TEXT,
        updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
      CREATE INDEX IF NOT EXISTS system_settings_key_idx ON system_settings(key);
    `);
    console.log('  - System settings table created');

    console.log('==> All migrations complete!');
  } catch (error) {
    console.error('Migration error:', error.message);
    // Don't exit with error - let the API try to start anyway
    // Tables might already exist from a previous run
  } finally {
    await sql.end();
  }
}

migrate();
