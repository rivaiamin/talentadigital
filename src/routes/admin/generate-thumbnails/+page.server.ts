import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { fail, redirect } from '@sveltejs/kit';
import { readFile, writeFile, mkdir, readdir } from 'fs/promises';
import { join } from 'path';
import { generateResponsiveImages, generateResponsiveFilenames } from '$lib/server/image-utils';
import { eq, isNotNull } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async (event) => {
	// Check if user is authenticated (you might want to add admin check here)
	if (!event.locals.user) {
		throw redirect(302, '/auth/login');
	}

	// Get list of talents with images
	const talents = await db.select().from(table.talent).where(isNotNull(table.talent.pictureUrl));

	// Scan for existing images that need thumbnails
	const uploadsDir = join(process.cwd(), 'static', 'uploads');
	const existingImages: Array<{ filename: string; userId: string; needsThumbnails: boolean }> = [];

	try {
		const files = await readdir(uploadsDir);
		
		for (const file of files) {
			if (!/\.(jpg|jpeg|png|webp)$/i.test(file)) continue;
			
			// Check if this file has responsive variants
			const hasVariants = file.includes('_thumb.') || file.includes('_medium.') || file.includes('_full.');
			
			// Extract user ID from filename (supports both patterns)
			let userIdMatch = file.match(/^([^_]+)_\d+\./);
			if (!userIdMatch) {
				userIdMatch = file.match(/^([^_]+)\./);
			}
			const userId = userIdMatch ? userIdMatch[1] : null;
			
			if (userId) {
				existingImages.push({
					filename: file,
					userId,
					needsThumbnails: !hasVariants
				});
			}
		}
	} catch (err) {
		console.error('Error scanning uploads directory:', err);
	}

	return {
		talents,
		existingImages
	};
};

export const actions: Actions = {
	generateAll: async (event) => {
		if (!event.locals.user) {
			throw redirect(302, '/auth/login');
		}

		const uploadsDir = join(process.cwd(), 'static', 'uploads');
		await mkdir(uploadsDir, { recursive: true });

		let processed = 0;
		let failed = 0;
		const results: string[] = [];

		try {
			const files = await readdir(uploadsDir);
			
			for (const file of files) {
				if (!/\.(jpg|jpeg|png|webp)$/i.test(file)) continue;
				
				// Skip files that already have responsive variants
				if (file.includes('_thumb.') || file.includes('_medium.') || file.includes('_full.')) {
					continue;
				}
				
				// Extract user ID from filename (supports both patterns)
				let userIdMatch = file.match(/^([^_]+)_\d+\./);
				if (!userIdMatch) {
					userIdMatch = file.match(/^([^_]+)\./);
				}
				if (!userIdMatch) continue;
				
				const userId = userIdMatch[1];
				const filePath = join(uploadsDir, file);
				
				try {
					// Read the original image
					const buffer = await readFile(filePath);
					
					// Generate responsive images
					const timestamp = Date.now() + processed;
					const responsiveImages = await generateResponsiveImages(buffer, userId, 85);
					const filenames = generateResponsiveFilenames(userId, 'webp', timestamp);
					
					// Save all variants
					await writeFile(join(uploadsDir, filenames.thumbnail), responsiveImages.thumbnail.buffer);
					await writeFile(join(uploadsDir, filenames.medium), responsiveImages.medium.buffer);
					await writeFile(join(uploadsDir, filenames.full), responsiveImages.full.buffer);
					
					// Update database record
					const newUrl = `/uploads/${filenames.full}`;
					await db
						.update(table.talent)
						.set({ pictureUrl: newUrl })
						.where(eq(table.talent.userId, userId));
					
					processed++;
					results.push(`✅ Generated thumbnails for ${file} (user: ${userId})`);
				} catch (error) {
					failed++;
					results.push(`❌ Failed to process ${file}: ${error}`);
				}
			}
		} catch (error) {
			return fail(500, { 
				message: 'Failed to scan uploads directory',
				results: [`❌ Error: ${error}`]
			});
		}

		return {
			success: true,
			message: `Generated thumbnails for ${processed} images, ${failed} failed`,
			results
		};
	},

	generateForUser: async (event) => {
		if (!event.locals.user) {
			throw redirect(302, '/auth/login');
		}

		const formData = await event.request.formData();
		const userId = formData.get('userId') as string;

		if (!userId) {
			return fail(400, { message: 'User ID is required' });
		}

		const uploadsDir = join(process.cwd(), 'static', 'uploads');
		let processed = 0;
		let failed = 0;
		const results: string[] = [];

		try {
			const files = await readdir(uploadsDir);
			
			for (const file of files) {
				if (!/\.(jpg|jpeg|png|webp)$/i.test(file)) continue;
				if (file.includes('_thumb.') || file.includes('_medium.') || file.includes('_full.')) continue;
				if (!file.startsWith(userId + '_')) continue;
				
				const filePath = join(uploadsDir, file);
				
				try {
					const buffer = await readFile(filePath);
					const timestamp = Date.now() + processed;
					const responsiveImages = await generateResponsiveImages(buffer, userId, 85);
					const filenames = generateResponsiveFilenames(userId, 'webp', timestamp);
					
					await writeFile(join(uploadsDir, filenames.thumbnail), responsiveImages.thumbnail.buffer);
					await writeFile(join(uploadsDir, filenames.medium), responsiveImages.medium.buffer);
					await writeFile(join(uploadsDir, filenames.full), responsiveImages.full.buffer);
					
					const newUrl = `/uploads/${filenames.full}`;
					await db
						.update(table.talent)
						.set({ pictureUrl: newUrl })
						.where(eq(table.talent.userId, userId));
					
					processed++;
					results.push(`✅ Generated thumbnails for ${file}`);
				} catch (error) {
					failed++;
					results.push(`❌ Failed to process ${file}: ${error}`);
				}
			}
		} catch (error) {
			return fail(500, { 
				message: 'Failed to process images for user',
				results: [`❌ Error: ${error}`]
			});
		}

		return {
			success: true,
			message: `Generated thumbnails for ${processed} images for user ${userId}, ${failed} failed`,
			results
		};
	}
};
