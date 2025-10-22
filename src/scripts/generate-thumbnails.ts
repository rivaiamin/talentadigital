#!/usr/bin/env tsx
/**
 * Utility script to generate responsive thumbnails for existing talent images
 * Run with: npx tsx src/scripts/generate-thumbnails.ts
 */

import { readFile, writeFile, mkdir, readdir, stat } from 'fs/promises';
import { join, basename, dirname } from 'path';
// import sharp from 'sharp';
import { db } from '../lib/server/db';
import * as table from '../lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { generateResponsiveImages, generateResponsiveFilenames } from '../lib/server/image-utils';

interface ExistingImage {
	filePath: string;
	filename: string;
	userId?: string;
}

/**
 * Check if an image already has responsive variants
 */
function hasResponsiveVariants(filename: string): boolean {
	return filename.includes('_thumb.') || filename.includes('_medium.') || filename.includes('_full.');
}

/**
 * Extract user ID from filename (supports both: userId.ext and userId_timestamp.ext)
 */
function extractUserIdFromFilename(filename: string): string | null {
	// Try pattern with timestamp first: userId_timestamp.ext
	let match = filename.match(/^([^_]+)_\d+\./);
	if (match) return match[1];
	
	// Try simple pattern: userId.ext
	match = filename.match(/^([^_]+)\./);
	if (match) return match[1];
	
	return null;
}

/**
 * Generate responsive variants for a single image
 */
async function generateVariantsForImage(
	filePath: string,
	userId: string,
	timestamp: number
): Promise<{ thumbnail: string; medium: string; full: string } | null> {
	try {
		console.log(`Processing: ${filePath}`);
		
		// Read the original image
		const buffer = await readFile(filePath);
		
		// Generate responsive images
		const responsiveImages = await generateResponsiveImages(buffer, userId, 85);
		const filenames = generateResponsiveFilenames(userId, 'webp', timestamp);
		
		// Get the uploads directory
		const uploadsDir = dirname(filePath);
		
		// Save all variants
		await writeFile(join(uploadsDir, filenames.thumbnail), responsiveImages.thumbnail.buffer);
		await writeFile(join(uploadsDir, filenames.medium), responsiveImages.medium.buffer);
		await writeFile(join(uploadsDir, filenames.full), responsiveImages.full.buffer);
		
		console.log(`✓ Generated variants for ${basename(filePath)}`);
		console.log(`  - Thumbnail: ${filenames.thumbnail} (${responsiveImages.thumbnail.size} bytes)`);
		console.log(`  - Medium: ${filenames.medium} (${responsiveImages.medium.size} bytes)`);
		console.log(`  - Full: ${filenames.full} (${responsiveImages.full.size} bytes)`);
		
		return filenames;
	} catch (error) {
		console.error(`✗ Failed to process ${filePath}:`, error);
		return null;
	}
}

/**
 * Update database record with new full-size URL
 */
async function updateDatabaseRecord(userId: string, newUrl: string): Promise<void> {
	try {
		await db
			.update(table.talent)
			.set({ pictureUrl: newUrl })
			.where(eq(table.talent.userId, userId));
		
		console.log(`✓ Updated database record for user ${userId}`);
	} catch (error) {
		console.error(`✗ Failed to update database for user ${userId}:`, error);
	}
}

/**
 * Scan uploads directory for existing images
 */
async function scanExistingImages(): Promise<ExistingImage[]> {
	const uploadsDir = join(process.cwd(), 'static', 'uploads');
	const images: ExistingImage[] = [];
	
	try {
		const files = await readdir(uploadsDir);
		
		for (const file of files) {
			// Skip directories and non-image files
			if (!/\.(jpg|jpeg|png|webp)$/i.test(file)) continue;
			
			// Skip files that already have responsive variants
			if (hasResponsiveVariants(file)) continue;
			
			const filePath = join(uploadsDir, file);
			const stats = await stat(filePath);
			
			// Skip if it's a directory
			if (stats.isDirectory()) continue;
			
			const userId = extractUserIdFromFilename(file);
			
			images.push({
				filePath,
				filename: file,
				userId: userId || undefined
			});
		}
	} catch (error) {
		console.error('Error scanning uploads directory:', error);
	}
	
	return images;
}

/**
 * Main function to generate thumbnails for all existing images
 */
async function generateThumbnailsForExistingImages() {
	console.log('🖼️  Starting thumbnail generation for existing images...\n');
	
	// Ensure uploads directory exists
	const uploadsDir = join(process.cwd(), 'static', 'uploads');
	await mkdir(uploadsDir, { recursive: true });
	
	// Scan for existing images
	console.log('📁 Scanning for existing images...');
	const existingImages = await scanExistingImages();
	
	if (existingImages.length === 0) {
		console.log('✅ No existing images found that need thumbnail generation.');
		return;
	}
	
	console.log(`Found ${existingImages.length} images that need thumbnail generation:\n`);
	
	// Process each image
	let processed = 0;
	let failed = 0;
	
	for (const image of existingImages) {
		const userId = image.userId || 'unknown';
		const timestamp = Date.now() + processed; // Ensure unique timestamps
		
		const variants = await generateVariantsForImage(image.filePath, userId, timestamp);
		
		if (variants) {
			processed++;
			
			// Update database if we have a valid user ID
			if (image.userId) {
				const newUrl = `/uploads/${variants.full}`;
				await updateDatabaseRecord(image.userId, newUrl);
			}
			
			// Optional: Remove original file to save space
			// await unlink(image.filePath);
			// console.log(`🗑️  Removed original file: ${image.filename}`);
		} else {
			failed++;
		}
		
		console.log(''); // Empty line for readability
	}
	
	console.log('📊 Summary:');
	console.log(`✅ Successfully processed: ${processed} images`);
	console.log(`❌ Failed to process: ${failed} images`);
	console.log(`📁 Total images found: ${existingImages.length}`);
	
	if (processed > 0) {
		console.log('\n🎉 Thumbnail generation completed!');
		console.log('💡 Tip: You may want to restart your development server to see the changes.');
	}
}

/**
 * Generate thumbnails for a specific user
 */
async function generateThumbnailsForUser(userId: string) {
	console.log(`🖼️  Generating thumbnails for user: ${userId}\n`);
	
	const uploadsDir = join(process.cwd(), 'static', 'uploads');
	const images: ExistingImage[] = [];
	
	try {
		const files = await readdir(uploadsDir);
		
		for (const file of files) {
			if (!/\.(jpg|jpeg|png|webp)$/i.test(file)) continue;
			if (hasResponsiveVariants(file)) continue;
			if (!file.startsWith(userId + '_')) continue;
			
			const filePath = join(uploadsDir, file);
			const stats = await stat(filePath);
			
			if (stats.isDirectory()) continue;
			
			images.push({
				filePath,
				filename: file,
				userId
			});
		}
	} catch (error) {
		console.error('Error scanning for user images:', error);
		return;
	}
	
	if (images.length === 0) {
		console.log(`✅ No images found for user ${userId} that need thumbnail generation.`);
		return;
	}
	
	console.log(`Found ${images.length} images for user ${userId}:`);
	
	for (const image of images) {
		const timestamp = Date.now();
		const variants = await generateVariantsForImage(image.filePath, userId, timestamp);
		
		if (variants && image.userId) {
			const newUrl = `/uploads/${variants.full}`;
			await updateDatabaseRecord(image.userId, newUrl);
		}
	}
	
	console.log(`✅ Completed thumbnail generation for user ${userId}`);
}

// Command line interface
async function main() {
	const args = process.argv.slice(2);
	
	if (args.length === 0) {
		// Generate thumbnails for all existing images
		await generateThumbnailsForExistingImages();
	} else if (args[0] === '--user' && args[1]) {
		// Generate thumbnails for specific user
		await generateThumbnailsForUser(args[1]);
	} else if (args[0] === '--help') {
		console.log(`
🖼️  Thumbnail Generation Utility

Usage:
  npx tsx src/scripts/generate-thumbnails.ts              # Generate thumbnails for all existing images
  npx tsx src/scripts/generate-thumbnails.ts --user <id>  # Generate thumbnails for specific user
  npx tsx src/scripts/generate-thumbnails.ts --help       # Show this help

Examples:
  npx tsx src/scripts/generate-thumbnails.ts
  npx tsx src/scripts/generate-thumbnails.ts --user user123
		`);
	} else {
		console.log('❌ Invalid arguments. Use --help for usage information.');
	}
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
	main().catch(console.error);
}
