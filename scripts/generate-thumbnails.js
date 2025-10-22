#!/usr/bin/env node
/**
 * Simple Node.js script to generate thumbnails for existing talent images
 * Run with: node scripts/generate-thumbnails.js
 */

import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const UPLOADS_DIR = path.join(process.cwd(), 'static', 'uploads');
const QUALITY = 85;

/**
 * Check if an image already has responsive variants
 */
function hasResponsiveVariants(filename) {
	return filename.includes('_thumb.') || filename.includes('_medium.') || filename.includes('_full.');
}

/**
 * Extract user ID from filename (supports both: userId.ext and userId_timestamp.ext)
 */
function extractUserIdFromFilename(filename) {
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
async function generateVariantsForImage(filePath, userId, timestamp) {
	try {
		console.log(`Processing: ${path.basename(filePath)}`);
		
		// Read the original image
		const buffer = await fs.readFile(filePath);
		
		// Get file extension
		const ext = path.extname(filePath).toLowerCase();
		const format = ext === '.png' ? 'png' : ext === '.webp' ? 'webp' : 'jpeg';
		
		// Generate filenames
		const baseName = `${userId}_${timestamp}`;
		const filenames = {
			thumbnail: `${baseName}_thumb.webp`,
			medium: `${baseName}_medium.webp`,
			full: `${baseName}_full.webp`
		};
		
		// Generate thumbnail (128x128)
		const thumbnailBuffer = await sharp(buffer)
			.resize(128, 128, { fit: 'inside', withoutEnlargement: true })
			.webp({ quality: QUALITY, effort: 6 })
			.toBuffer();
		
		// Generate medium (400x400)
		const mediumBuffer = await sharp(buffer)
			.resize(400, 400, { fit: 'inside', withoutEnlargement: true })
			.webp({ quality: QUALITY, effort: 6 })
			.toBuffer();
		
		// Generate full (800x800)
		const fullBuffer = await sharp(buffer)
			.resize(800, 800, { fit: 'inside', withoutEnlargement: true })
			.webp({ quality: QUALITY, effort: 6 })
			.toBuffer();
		
		// Save all variants
		await fs.writeFile(path.join(UPLOADS_DIR, filenames.thumbnail), thumbnailBuffer);
		await fs.writeFile(path.join(UPLOADS_DIR, filenames.medium), mediumBuffer);
		await fs.writeFile(path.join(UPLOADS_DIR, filenames.full), fullBuffer);
		
		console.log(`✓ Generated variants for ${path.basename(filePath)}`);
		console.log(`  - Thumbnail: ${filenames.thumbnail} (${thumbnailBuffer.length} bytes)`);
		console.log(`  - Medium: ${filenames.medium} (${mediumBuffer.length} bytes)`);
		console.log(`  - Full: ${filenames.full} (${fullBuffer.length} bytes)`);
		
		return filenames;
	} catch (error) {
		console.error(`✗ Failed to process ${path.basename(filePath)}:`, error.message);
		return null;
	}
}

/**
 * Scan uploads directory for existing images
 */
async function scanExistingImages() {
	const images = [];
	
	try {
		const files = await fs.readdir(UPLOADS_DIR);
		
		for (const file of files) {
			// Skip directories and non-image files
			if (!/\.(jpg|jpeg|png|webp)$/i.test(file)) continue;
			
			// Skip files that already have responsive variants
			if (hasResponsiveVariants(file)) continue;
			
			const filePath = path.join(UPLOADS_DIR, file);
			const stats = await fs.stat(filePath);
			
			// Skip if it's a directory
			if (stats.isDirectory()) continue;
			
			const userId = extractUserIdFromFilename(file);
			
			if (userId) {
				images.push({
					filePath,
					filename: file,
					userId
				});
			}
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
	await fs.mkdir(UPLOADS_DIR, { recursive: true });
	
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
		const timestamp = Date.now() + processed; // Ensure unique timestamps
		
		const variants = await generateVariantsForImage(image.filePath, image.userId, timestamp);
		
		if (variants) {
			processed++;
			console.log(`✓ Updated user ${image.userId} with new image URL: /uploads/${variants.full}`);
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
		console.log('💡 Note: You may need to update the database manually or use the web interface to update talent records.');
		console.log('🌐 Web interface: /admin/generate-thumbnails');
	}
}

// Command line interface
async function main() {
	const args = process.argv.slice(2);
	
	if (args.length === 0) {
		// Generate thumbnails for all existing images
		await generateThumbnailsForExistingImages();
	} else if (args[0] === '--help') {
		console.log(`
🖼️  Thumbnail Generation Utility

Usage:
  node scripts/generate-thumbnails.js              # Generate thumbnails for all existing images
  node scripts/generate-thumbnails.js --help       # Show this help

This script will:
- Scan the static/uploads directory for existing images
- Generate 3 responsive sizes: thumbnail (128x128), medium (400x400), full (800x800)
- Convert all images to WebP format for better compression
- Save the new images with descriptive filenames

Note: This script only generates the image files. You may need to update the database
records manually or use the web interface at /admin/generate-thumbnails
		`);
	} else {
		console.log('❌ Invalid arguments. Use --help for usage information.');
	}
}

// Run the script
main().catch(console.error);
