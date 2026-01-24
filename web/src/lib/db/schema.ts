import { pgTable, serial, text, timestamp, boolean, integer, jsonb, uuid } from 'drizzle-orm/pg-core';

export const waitlist = pgTable('waitlist', {
    id: serial('id').primaryKey(),
    email: text('email').notNull().unique(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    confirmed: boolean('confirmed').default(false),
    source: text('source').default('website'),
});

export const downloads = pgTable('downloads', {
    id: serial('id').primaryKey(),
    os: text('os').notNull(), // 'windows', 'macos', 'linux'
    version: text('version').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    userAgent: text('user_agent'),
});

export const stats = pgTable('stats', {
    id: serial('id').primaryKey(),
    key: text('key').notNull().unique(), // e.g., 'total_signups', 'github_stars'
    value: integer('value').notNull().default(0),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ============================================================================
// Cloud Sync Tables
// ============================================================================

/**
 * Users table for cloud sync authentication
 * Each user has a unique access key (API key) for authentication
 */
export const cloudSyncUsers = pgTable('cloud_sync_users', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: text('email').notNull().unique(),
    // Hashed access key for authentication (client stores the raw key)
    accessKeyHash: text('access_key_hash').notNull(),
    // Salt used for deriving encryption key on client side
    encryptionSalt: text('encryption_salt').notNull(),
    // Display name for the account
    displayName: text('display_name'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    lastSyncAt: timestamp('last_sync_at'),
    // Whether the account is active
    isActive: boolean('is_active').default(true).notNull(),
    // Plan type for future monetization
    planType: text('plan_type').default('free').notNull(), // 'free', 'pro'
    // DodoPayments subscription fields
    customerId: text('customer_id'),
    subscriptionId: text('subscription_id'),
    subscriptionStatus: text('subscription_status').default('inactive'),
});

/**
 * Devices registered for cloud sync
 * Each device has a unique identifier and can sync independently
 */
export const cloudSyncDevices = pgTable('cloud_sync_devices', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull().references(() => cloudSyncUsers.id, { onDelete: 'cascade' }),
    // Client-generated device ID (stored hash for privacy)
    deviceIdHash: text('device_id_hash').notNull(),
    // Friendly device name
    deviceName: text('device_name').notNull(),
    // Operating system
    os: text('os').notNull(), // 'windows', 'macos', 'linux'
    // App version
    appVersion: text('app_version'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    lastSeenAt: timestamp('last_seen_at').defaultNow().notNull(),
});

/**
 * Encrypted sync data - stores E2E encrypted configuration backups
 * All data is encrypted client-side before being sent to the server
 * The server never sees the plaintext data
 */
export const cloudSyncBackups = pgTable('cloud_sync_backups', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull().references(() => cloudSyncUsers.id, { onDelete: 'cascade' }),
    deviceId: uuid('device_id').references(() => cloudSyncDevices.id, { onDelete: 'set null' }),
    // What type of data this is
    dataType: text('data_type').notNull(), // 'projects', 'mcp_config', 'settings', 'api_keys', 'profile', 'full_backup'
    // E2E encrypted data (client encrypts before upload)
    encryptedData: text('encrypted_data').notNull(),
    // Initialization vector for decryption
    iv: text('iv').notNull(),
    // Auth tag for AEAD encryption
    authTag: text('auth_tag').notNull(),
    // Version for conflict resolution (increments with each update)
    version: integer('version').notNull().default(1),
    // SHA-256 hash of plaintext for integrity verification (calculated client-side)
    plaintextHash: text('plaintext_hash').notNull(),
    // Size of the plaintext data (for quotas)
    plaintextSize: integer('plaintext_size').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * Sync log for auditing and debugging
 */
export const cloudSyncLogs = pgTable('cloud_sync_logs', {
    id: serial('id').primaryKey(),
    userId: uuid('user_id').notNull().references(() => cloudSyncUsers.id, { onDelete: 'cascade' }),
    deviceId: uuid('device_id').references(() => cloudSyncDevices.id, { onDelete: 'set null' }),
    action: text('action').notNull(), // 'push', 'pull', 'register_device', 'delete_backup'
    dataType: text('data_type'),
    success: boolean('success').notNull(),
    errorMessage: text('error_message'),
    metadata: jsonb('metadata'), // Additional context
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Type exports
export type Waitlist = typeof waitlist.$inferSelect;
export type NewWaitlist = typeof waitlist.$inferInsert;
export type Download = typeof downloads.$inferSelect;
export type NewDownload = typeof downloads.$inferInsert;
export type Stats = typeof stats.$inferSelect;

export type CloudSyncUser = typeof cloudSyncUsers.$inferSelect;
export type NewCloudSyncUser = typeof cloudSyncUsers.$inferInsert;
export type CloudSyncDevice = typeof cloudSyncDevices.$inferSelect;
export type NewCloudSyncDevice = typeof cloudSyncDevices.$inferInsert;
export type CloudSyncBackup = typeof cloudSyncBackups.$inferSelect;
export type NewCloudSyncBackup = typeof cloudSyncBackups.$inferInsert;
export type CloudSyncLog = typeof cloudSyncLogs.$inferSelect;
export type NewCloudSyncLog = typeof cloudSyncLogs.$inferInsert;
