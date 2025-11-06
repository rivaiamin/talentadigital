import { readFile, readdir, stat } from 'fs/promises';
import { join } from 'path';
import { db } from '../src/lib/server/db';
import * as table from '../src/lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { uploadImageToSupabase, generateSupabasePath, isSupabaseConfigured } from '../src/lib/server/supabase-storage';

interface MigrationResult {
	success: number;
	failed: number;
	errors: string[];
}

/**
 * Migrate existing local images to Supabase Storage
 */
async function migrateImagesToSupabase(): Promise<MigrationResult> {
	const result: MigrationResult = {
		success: 0,
		failed: 0,
		errors: []
	};

	if (!isSupabaseConfigured()) {
		result.errors.push('Supabase is not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY environment variables.');
		return result;
	}

	try {
		// Get all talents with picture URLs
		const talents = await db
			.select()
			.from(table.talent)
			.where(eq(table.talent.pictureUrl, '/uploads/'));

		console.log(`Found ${talents.length} talents with local images to migrate`);

		for (const talent of talents) {
			try {
				if (!talent.pictureUrl || !talent.pictureUrl.startsWith('/uploads/')) {
					continue; // Skip if not a local image
				}

				const localPath = join(process.cwd(), 'static', talent.pictureUrl);
				
				// Check if file exists
				try {
					await stat(localPath);
				} catch {
					console.log(`File not found: ${localPath}, skipping...`);
					continue;
				}

				// Read the image file
				const imageBuffer = await readFile(localPath);
				
				// Generate new Supabase path
				const timestamp = Date.now();
				const basePath = generateSupabasePath(talent.userId, timestamp);
				
				// Upload to Supabase
				const uploadResult = await uploadImageToSupabase(
					imageBuffer,
					`${basePath}_full.webp`,
					'profile-pictures'
				);

				// Update database with new URL
				await db
					.update(table.talent)
					.set({
						pictureUrl: uploadResult.url,
						pictureUrls: JSON.stringify({
							thumbnail: uploadResult.url, // For now, use same URL for all sizes
							medium: uploadResult.url,
							full: uploadResult.url
						})
					})
					.where(eq(table.talent.id, talent.id));

				console.log(`Migrated image for talent ${talent.username}: ${talent.pictureUrl} -> ${uploadResult.url}`);
				result.success++;

			} catch (error) {
				console.error(`Failed to migrate image for talent ${talent.username}:`, error);
				result.failed++;
				result.errors.push(`Talent ${talent.username}: ${error instanceof Error ? error.message : 'Unknown error'}`);
			}
		}

	} catch (error) {
		console.error('Migration failed:', error);
		result.errors.push(`Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
	}

	return result;
}

/**
 * Clean up local uploads directory after successful migration
 */
async function cleanupLocalImages(): Promise<void> {
	try {
		const uploadsDir = join(process.cwd(), 'static', 'uploads');
		const files = await readdir(uploadsDir);
		
		console.log(`Found ${files.length} files in uploads directory`);
		
		// Note: In a real migration, you might want to backup the files first
		// or move them to a backup directory instead of deleting them
		console.log('Note: Local files are preserved. You can manually delete them after verifying the migration.');
		
	} catch (error) {
		console.error('Error during cleanup:', error);
	}
}

/**
 * Main migration function
 */
async function main() {
	console.log('Starting image migration to Supabase...');
	
	const result = await migrateImagesToSupabase();
	
	console.log('\n=== Migration Results ===');
	console.log(`Successfully migrated: ${result.success} images`);
	console.log(`Failed: ${result.failed} images`);
	
	if (result.errors.length > 0) {
		console.log('\nErrors:');
		result.errors.forEach(error => console.log(`- ${error}`));
	}
	
	if (result.success > 0) {
		console.log('\nMigration completed successfully!');
		console.log('You can now delete the local uploads directory if desired.');
		await cleanupLocalImages();
	}
}

// Run migration if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
	main().catch(console.error);
}

export { migrateImagesToSupabase, cleanupLocalImages };

