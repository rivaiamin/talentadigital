#!/usr/bin/env tsx

/**
 * Data migration script to transfer data from SQLite to PostgreSQL
 * 
 * Usage:
 * 1. Set up your PostgreSQL database and run migrations first
 * 2. Set DATABASE_URL environment variable
 * 3. Run: npx tsx scripts/migrate-sqlite-to-postgres.ts
 */

import { drizzle } from 'drizzle-orm/postgres-js';
import { drizzle as drizzleSqlite } from 'drizzle-orm/better-sqlite3';
import postgres from 'postgres';
import Database from 'better-sqlite3';
import { env } from '$env/dynamic/private';

// PostgreSQL schema (target)
import * as pgSchema from '../src/lib/server/db/schema';

// SQLite schema (source) - we'll define this inline since we're migrating away from it
import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

const sqliteUser = sqliteTable('user', {
	id: text('id').primaryKey(),
	fullName: text('full_name').notNull(),
	age: integer('age'),
	username: text('username').notNull().unique(),
	contactNumber: text('contact_number').notNull().unique(),
	passwordHash: text('password_hash').notNull()
});

const sqliteSession = sqliteTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => sqliteUser.id),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});

const sqliteTalent = sqliteTable('talent', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => sqliteUser.id),
	username: text('username').notNull().unique(),
	name: text('name').notNull(),
	services: text('services'),
	status: text('status').notNull(),
	location: text('location'),
	contactNumber: text('contact_number'),
	description: text('description'),
	pictureUrl: text('picture_url'),
	portfolioUrl: text('portfolio_url'),
	instagramUrl: text('instagram_url'),
	facebookUrl: text('facebook_url'),
	threadUrl: text('thread_url'),
	xUrl: text('x_url'),
	linkedinUrl: text('linkedin_url'),
	pricing: text('pricing')
});

const sqliteTalentPortfolio = sqliteTable('talent_portfolio', {
	id: text('id').primaryKey(),
	talentId: text('talent_id')
		.notNull()
		.references(() => sqliteTalent.id),
	description: text('description').notNull(),
	price: real('price'),
	pictureUrl: text('picture_url')
});

async function migrateData() {
	console.log('🚀 Starting SQLite to PostgreSQL migration...');

	// Check if DATABASE_URL is set
	if (!env.DATABASE_URL) {
		throw new Error('DATABASE_URL environment variable is not set');
	}

	// Connect to SQLite (source)
	const sqliteDb = new Database('./local.db');
	const sqliteDrizzle = drizzleSqlite(sqliteDb);

	// Connect to PostgreSQL (target)
	const postgresClient = postgres(env.DATABASE_URL);
	const postgresDrizzle = drizzle(postgresClient, { schema: pgSchema });

	try {
		// Migrate users
		console.log('📦 Migrating users...');
		const users = await sqliteDrizzle.select().from(sqliteUser);
		console.log(`Found ${users.length} users to migrate`);

		for (const user of users) {
			await postgresDrizzle.insert(pgSchema.user).values({
				id: user.id,
				fullName: user.fullName,
				age: user.age,
				username: user.username,
				contactNumber: user.contactNumber,
				passwordHash: user.passwordHash
			}).onConflictDoNothing();
		}

		// Migrate sessions
		console.log('🔐 Migrating sessions...');
		const sessions = await sqliteDrizzle.select().from(sqliteSession);
		console.log(`Found ${sessions.length} sessions to migrate`);

		for (const session of sessions) {
			await postgresDrizzle.insert(pgSchema.session).values({
				id: session.id,
				userId: session.userId,
				expiresAt: session.expiresAt
			}).onConflictDoNothing();
		}

		// Migrate talents
		console.log('👥 Migrating talents...');
		const talents = await sqliteDrizzle.select().from(sqliteTalent);
		console.log(`Found ${talents.length} talents to migrate`);

		for (const talent of talents) {
			// Parse services JSON string to array
			let services: string[] | undefined;
			if (talent.services) {
				try {
					services = JSON.parse(talent.services);
				} catch (e) {
					console.warn(`Failed to parse services for talent ${talent.id}:`, talent.services);
					services = undefined;
				}
			}

			await postgresDrizzle.insert(pgSchema.talent).values({
				id: talent.id,
				userId: talent.userId,
				username: talent.username,
				name: talent.name,
				services: services,
				status: talent.status,
				location: talent.location,
				contactNumber: talent.contactNumber,
				description: talent.description,
				pictureUrl: talent.pictureUrl,
				portfolioUrl: talent.portfolioUrl,
				instagramUrl: talent.instagramUrl,
				facebookUrl: talent.facebookUrl,
				threadUrl: talent.threadUrl,
				xUrl: talent.xUrl,
				linkedinUrl: talent.linkedinUrl,
				pricing: talent.pricing
			}).onConflictDoNothing();
		}

		// Migrate talent portfolios
		console.log('💼 Migrating talent portfolios...');
		const portfolios = await sqliteDrizzle.select().from(sqliteTalentPortfolio);
		console.log(`Found ${portfolios.length} portfolios to migrate`);

		for (const portfolio of portfolios) {
			await postgresDrizzle.insert(pgSchema.talentPortfolio).values({
				id: portfolio.id,
				talentId: portfolio.talentId,
				description: portfolio.description,
				price: portfolio.price ? portfolio.price.toString() : null,
				pictureUrl: portfolio.pictureUrl
			}).onConflictDoNothing();
		}

		console.log('✅ Migration completed successfully!');
		console.log(`📊 Migrated:`);
		console.log(`  - ${users.length} users`);
		console.log(`  - ${sessions.length} sessions`);
		console.log(`  - ${talents.length} talents`);
		console.log(`  - ${portfolios.length} portfolios`);

	} catch (error) {
		console.error('❌ Migration failed:', error);
		throw error;
	} finally {
		// Clean up connections
		sqliteDb.close();
		await postgresClient.end();
	}
}

// Run migration if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
	migrateData().catch((error) => {
		console.error('Migration failed:', error);
		process.exit(1);
	});
}

export { migrateData };
