import { pgTable, serial, text, timestamp, boolean, integer } from 'drizzle-orm/pg-core';

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

export type Waitlist = typeof waitlist.$inferSelect;
export type NewWaitlist = typeof waitlist.$inferInsert;
export type Download = typeof downloads.$inferSelect;
export type NewDownload = typeof downloads.$inferInsert;
export type Stats = typeof stats.$inferSelect;
