/**
 * OneShot Database Schema
 * Drizzle ORM schema definition for PostgreSQL
 * 
 * Entity Relationships:
 * - User 1:N Projects (ownership)
 * - Project 1:N Conversations
 * - Project 1:N Documents
 * - Conversation 1:N Messages
 * - Document 1:N DocumentVersions
 * - Conversation 1:N TokenUsage
 * - User N:M Projects (via ProjectMembers, future)
 */

import { pgTable, uuid, text, timestamp, integer, boolean, pgEnum, jsonb, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ============================================================================
// Enums
// ============================================================================

/** User role levels */
export const userRoleEnum = pgEnum('user_role', ['user', 'admin', 'super_admin']);

/** Project status */
export const projectStatusEnum = pgEnum('project_status', ['active', 'archived', 'completed']);

/** CID workflow phase */
export const cidPhaseEnum = pgEnum('cid_phase', ['discovery', 'design', 'stack', 'build']);

/** Message sender type */
export const messageSenderEnum = pgEnum('message_sender', ['user', 'assistant', 'system']);

/** Message input type */
export const messageInputTypeEnum = pgEnum('message_input_type', ['text', 'voice']);

/** Document type within CID workflow */
export const documentTypeEnum = pgEnum('document_type', [
  'discovery_output',
  'design_output', 
  'stack_output',
  'build_prompt',
  'custom'
]);

/** AI vendor identifier */
export const aiVendorEnum = pgEnum('ai_vendor', ['anthropic', 'openai', 'local']);

// ============================================================================
// Users
// ============================================================================

/** 
 * User accounts for authentication and authorization.
 * First registered user becomes super_admin automatically.
 */
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  
  /** User's email address. Used for login and magic links. Unique. */
  email: text('email').notNull().unique(),
  
  /** Display name shown in UI */
  name: text('name'),
  
  /** Argon2id password hash. Null if using magic-link-only auth. */
  passwordHash: text('password_hash'),
  
  /** User's role determining access levels */
  role: userRoleEnum('role').notNull().default('user'),
  
  /** Whether email has been verified */
  emailVerified: boolean('email_verified').notNull().default(false),
  
  /** Last login timestamp for security auditing */
  lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
  
  // Standard timestamps
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
}, (table) => ({
  emailIdx: index('users_email_idx').on(table.email),
}));

export const usersRelations = relations(users, ({ many }) => ({
  projects: many(projects),
  magicLinks: many(magicLinks),
  refreshTokens: many(refreshTokens),
}));

// ============================================================================
// Authentication Support
// ============================================================================

/**
 * Magic link tokens for passwordless authentication.
 * Tokens expire after 15 minutes.
 */
export const magicLinks = pgTable('magic_links', {
  id: uuid('id').primaryKey().defaultRandom(),
  
  /** User this magic link belongs to */
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  
  /** Secure random token sent in email */
  token: text('token').notNull().unique(),
  
  /** When this token expires (15 minutes from creation) */
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  
  /** Whether this token has been used */
  usedAt: timestamp('used_at', { withTimezone: true }),
  
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  tokenIdx: index('magic_links_token_idx').on(table.token),
  userIdx: index('magic_links_user_id_idx').on(table.userId),
}));

export const magicLinksRelations = relations(magicLinks, ({ one }) => ({
  user: one(users, {
    fields: [magicLinks.userId],
    references: [users.id],
  }),
}));

/**
 * Refresh tokens for JWT authentication.
 * Access tokens are short-lived (15 min), refresh tokens longer (7 days).
 */
export const refreshTokens = pgTable('refresh_tokens', {
  id: uuid('id').primaryKey().defaultRandom(),
  
  /** User this refresh token belongs to */
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  
  /** Hashed refresh token */
  tokenHash: text('token_hash').notNull().unique(),
  
  /** When this token expires (7 days from creation) */
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  
  /** When this token was revoked (null if still valid) */
  revokedAt: timestamp('revoked_at', { withTimezone: true }),
  
  /** Device/browser identifier for token management UI */
  deviceInfo: text('device_info'),
  
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  tokenHashIdx: index('refresh_tokens_token_hash_idx').on(table.tokenHash),
  userIdx: index('refresh_tokens_user_id_idx').on(table.userId),
}));

export const refreshTokensRelations = relations(refreshTokens, ({ one }) => ({
  user: one(users, {
    fields: [refreshTokens.userId],
    references: [users.id],
  }),
}));

// ============================================================================
// Projects
// ============================================================================

/**
 * Projects are the top-level container for CID workflow.
 * Each project progresses through discovery → design → stack phases.
 */
export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  
  /** Project owner */
  ownerId: uuid('owner_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  
  /** Project name displayed in dashboard */
  name: text('name').notNull(),
  
  /** Brief description of the project */
  description: text('description'),
  
  /** Current workflow status */
  status: projectStatusEnum('status').notNull().default('active'),
  
  /** Current CID phase */
  currentPhase: cidPhaseEnum('current_phase').notNull().default('discovery'),
  
  /** Total tokens used across all phases */
  totalTokensUsed: integer('total_tokens_used').notNull().default(0),
  
  // LiveKit preparation (v1.1)
  /** LiveKit room name when multi-user enabled */
  livekitRoomName: text('livekit_room_name'),
  
  // Standard timestamps
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
}, (table) => ({
  ownerIdx: index('projects_owner_id_idx').on(table.ownerId),
  statusIdx: index('projects_status_idx').on(table.status),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  owner: one(users, {
    fields: [projects.ownerId],
    references: [users.id],
  }),
  conversations: many(conversations),
  documents: many(documents),
  members: many(projectMembers),
}));

/**
 * Project members for future collaborative features (v1.1+).
 * Schema prepared in v1 but not actively used.
 */
export const projectMembers = pgTable('project_members', {
  id: uuid('id').primaryKey().defaultRandom(),
  
  projectId: uuid('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  
  /** Role within this project */
  role: text('role').notNull().default('member'), // owner, moderator, member
  
  /** Invitation status */
  invitedAt: timestamp('invited_at', { withTimezone: true }),
  acceptedAt: timestamp('accepted_at', { withTimezone: true }),
  
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  projectUserIdx: index('project_members_project_user_idx').on(table.projectId, table.userId),
}));

export const projectMembersRelations = relations(projectMembers, ({ one }) => ({
  project: one(projects, {
    fields: [projectMembers.projectId],
    references: [projects.id],
  }),
  user: one(users, {
    fields: [projectMembers.userId],
    references: [users.id],
  }),
}));

// ============================================================================
// Conversations
// ============================================================================

/**
 * Conversations are chat sessions within a project phase.
 * Each phase may have multiple conversations (e.g., multiple discovery sessions).
 */
export const conversations = pgTable('conversations', {
  id: uuid('id').primaryKey().defaultRandom(),
  
  /** Parent project */
  projectId: uuid('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  
  /** Which CID phase this conversation belongs to */
  phase: cidPhaseEnum('phase').notNull(),
  
  /** Optional title (auto-generated or user-set) */
  title: text('title'),
  
  /** Tokens used in this conversation */
  tokensUsed: integer('tokens_used').notNull().default(0),
  
  /** Whether conversation is currently active */
  isActive: boolean('is_active').notNull().default(true),
  
  // LiveKit preparation (v1.1)
  /** Session ID for multi-user voice sessions */
  livekitSessionId: text('livekit_session_id'),
  
  // Standard timestamps
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
}, (table) => ({
  projectIdx: index('conversations_project_id_idx').on(table.projectId),
  phaseIdx: index('conversations_phase_idx').on(table.phase),
}));

export const conversationsRelations = relations(conversations, ({ one, many }) => ({
  project: one(projects, {
    fields: [conversations.projectId],
    references: [projects.id],
  }),
  messages: many(messages),
  tokenUsage: many(tokenUsage),
}));

// ============================================================================
// Messages
// ============================================================================

/**
 * Individual messages within a conversation.
 * Includes both text and voice inputs (voice stored as transcript).
 */
export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  
  /** Parent conversation */
  conversationId: uuid('conversation_id').notNull().references(() => conversations.id, { onDelete: 'cascade' }),
  
  /** Who sent this message */
  sender: messageSenderEnum('sender').notNull(),
  
  /** How the message was input */
  inputType: messageInputTypeEnum('input_type').notNull().default('text'),
  
  /** Message content (text or voice transcript) */
  content: text('content').notNull(),
  
  /** Token count for this message (if from AI) */
  tokensUsed: integer('tokens_used'),
  
  /** Voice-specific metadata */
  voiceMetadata: jsonb('voice_metadata').$type<{
    /** Duration of voice input in seconds */
    durationSeconds?: number;
    /** STT confidence score if available */
    confidence?: number;
    /** Latency metrics for debugging */
    latencyMs?: {
      stt?: number;
      ai?: number;
      tts?: number;
    };
  }>(),
  
  // Standard timestamps
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  conversationIdx: index('messages_conversation_id_idx').on(table.conversationId),
  createdIdx: index('messages_created_at_idx').on(table.createdAt),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
}));

// ============================================================================
// Token Usage Tracking
// ============================================================================

/**
 * Detailed token usage records for cost tracking.
 * Enables per-session, per-phase, per-project reporting.
 */
export const tokenUsage = pgTable('token_usage', {
  id: uuid('id').primaryKey().defaultRandom(),
  
  /** Associated conversation */
  conversationId: uuid('conversation_id').notNull().references(() => conversations.id, { onDelete: 'cascade' }),
  
  /** Which AI vendor was used */
  vendor: aiVendorEnum('vendor').notNull(),
  
  /** Specific model used (e.g., claude-opus-4-5-20250514) */
  model: text('model').notNull(),
  
  /** Input tokens (prompt) */
  inputTokens: integer('input_tokens').notNull(),
  
  /** Output tokens (completion) */
  outputTokens: integer('output_tokens').notNull(),
  
  /** Estimated cost in USD (for display, not billing) */
  estimatedCostUsd: integer('estimated_cost_usd'), // Store as cents to avoid float issues
  
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  conversationIdx: index('token_usage_conversation_id_idx').on(table.conversationId),
  vendorIdx: index('token_usage_vendor_idx').on(table.vendor),
}));

export const tokenUsageRelations = relations(tokenUsage, ({ one }) => ({
  conversation: one(conversations, {
    fields: [tokenUsage.conversationId],
    references: [conversations.id],
  }),
}));

// ============================================================================
// Documents
// ============================================================================

/**
 * Documents are the output artifacts of each CID phase.
 * Each document has version history for tracking edits.
 */
export const documents = pgTable('documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  
  /** Parent project */
  projectId: uuid('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  
  /** Type of document */
  type: documentTypeEnum('type').notNull(),
  
  /** Which phase produced this document */
  phase: cidPhaseEnum('phase').notNull(),
  
  /** Document title */
  title: text('title').notNull(),
  
  /** Current content (latest version) */
  content: text('content').notNull(),
  
  /** Content format */
  format: text('format').notNull().default('markdown'), // markdown, json, yaml
  
  /** Whether document is locked from editing */
  isLocked: boolean('is_locked').notNull().default(false),
  
  // Standard timestamps
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
}, (table) => ({
  projectIdx: index('documents_project_id_idx').on(table.projectId),
  typeIdx: index('documents_type_idx').on(table.type),
  phaseIdx: index('documents_phase_idx').on(table.phase),
}));

export const documentsRelations = relations(documents, ({ one, many }) => ({
  project: one(projects, {
    fields: [documents.projectId],
    references: [projects.id],
  }),
  versions: many(documentVersions),
}));

/**
 * Document version history for tracking edits over time.
 */
export const documentVersions = pgTable('document_versions', {
  id: uuid('id').primaryKey().defaultRandom(),
  
  /** Parent document */
  documentId: uuid('document_id').notNull().references(() => documents.id, { onDelete: 'cascade' }),
  
  /** Version number (1, 2, 3, ...) */
  version: integer('version').notNull(),
  
  /** Content at this version */
  content: text('content').notNull(),
  
  /** Optional change description */
  changeNote: text('change_note'),
  
  /** Who made this edit (null for AI-generated) */
  editedBy: uuid('edited_by').references(() => users.id, { onDelete: 'set null' }),
  
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  documentIdx: index('document_versions_document_id_idx').on(table.documentId),
  versionIdx: index('document_versions_version_idx').on(table.documentId, table.version),
}));

export const documentVersionsRelations = relations(documentVersions, ({ one }) => ({
  document: one(documents, {
    fields: [documentVersions.documentId],
    references: [documents.id],
  }),
  editor: one(users, {
    fields: [documentVersions.editedBy],
    references: [users.id],
  }),
}));

// ============================================================================
// Admin Settings
// ============================================================================

/**
 * System-wide settings configurable by admins.
 * Key-value store for flexibility.
 */
export const systemSettings = pgTable('system_settings', {
  id: uuid('id').primaryKey().defaultRandom(),
  
  /** Setting key (unique identifier) */
  key: text('key').notNull().unique(),
  
  /** Setting value (JSON for complex values) */
  value: jsonb('value').notNull(),
  
  /** Description for admin UI */
  description: text('description'),
  
  /** Who last updated this setting */
  updatedBy: uuid('updated_by').references(() => users.id, { onDelete: 'set null' }),
  
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  keyIdx: index('system_settings_key_idx').on(table.key),
}));

// ============================================================================
// Type Exports for Application Use
// ============================================================================

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

export type Conversation = typeof conversations.$inferSelect;
export type NewConversation = typeof conversations.$inferInsert;

export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;

export type Document = typeof documents.$inferSelect;
export type NewDocument = typeof documents.$inferInsert;

export type DocumentVersion = typeof documentVersions.$inferSelect;
export type NewDocumentVersion = typeof documentVersions.$inferInsert;

export type TokenUsageRecord = typeof tokenUsage.$inferSelect;
export type NewTokenUsageRecord = typeof tokenUsage.$inferInsert;
