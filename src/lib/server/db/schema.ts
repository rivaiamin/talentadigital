import { integer, pgTable, text, timestamp, decimal, json } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	fullName: text('full_name').notNull(),
	age: integer('age'),
	username: text('username').notNull().unique(),
	contactNumber: text('contact_number').notNull().unique(),
	passwordHash: text('password_hash').notNull()
});

export const session = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: timestamp('expires_at').notNull()
});

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;

// Talent profile for each user (1:1)
export const talent = pgTable('talent', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	username: text('username').notNull().unique(),
	name: text('name').notNull(),
	// Stored as JSON array of strings
	services: json('services').$type<string[]>(),
	// 'online' | 'offline' | 'hybrid'
	status: text('status').notNull(),
	location: text('location'),
	contactNumber: text('contact_number'),
	description: text('description'),
	pictureUrl: text('picture_url'),
	// Responsive image URLs stored as JSON
	pictureUrls: json('picture_urls').$type<{
		thumbnail: string;
		medium: string;
		full: string;
	}>(),
	portfolioUrl: text('portfolio_url'),
	// Social media URLs
	instagramUrl: text('instagram_url'),
	facebookUrl: text('facebook_url'),
	threadUrl: text('thread_url'),
	xUrl: text('x_url'),
	linkedinUrl: text('linkedin_url'),
	pricing: text('pricing')
});

export const talentPortfolio = pgTable('talent_portfolio', {
	id: text('id').primaryKey(),
	talentId: text('talent_id')
		.notNull()
		.references(() => talent.id),
	description: text('description').notNull(),
	// Decimal price stored as DECIMAL in PostgreSQL
	price: decimal('price', { precision: 10, scale: 2 }),
	pictureUrl: text('picture_url')
});

export type Talent = typeof talent.$inferSelect;
export type TalentPortfolio = typeof talentPortfolio.$inferSelect;
