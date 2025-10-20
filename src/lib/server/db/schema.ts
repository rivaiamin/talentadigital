import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	fullName: text('full_name').notNull(),
	age: integer('age'),
	username: text('username').notNull().unique(),
	contactNumber: text('contact_number').notNull().unique(),
	passwordHash: text('password_hash').notNull()
});

export const session = sqliteTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;

// Talent profile for each user (1:1)
export const talent = sqliteTable('talent', {
    id: text('id').primaryKey(),
    userId: text('user_id')
        .notNull()
        .references(() => user.id),
    name: text('name').notNull(),
    // Stored as JSON string of string[]
    services: text('services'),
    // 'active' | 'inactive'
    status: text('status').notNull(),
    location: text('location'),
    contactNumber: text('contact_number'),
    description: text('description'),
    pictureUrl: text('picture_url')
});

export const talentPortfolio = sqliteTable('talent_portfolio', {
    id: text('id').primaryKey(),
    talentId: text('talent_id')
        .notNull()
        .references(() => talent.id),
    description: text('description').notNull(),
    // Decimal price stored in SQLite REAL
    price: real('price'),
    pictureUrl: text('picture_url')
});

export type Talent = typeof talent.$inferSelect;
export type TalentPortfolio = typeof talentPortfolio.$inferSelect;
