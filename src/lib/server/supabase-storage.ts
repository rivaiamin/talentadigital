import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/private';

if (!env.SUPABASE_URL) throw new Error('SUPABASE_URL is not set');

// Use service role key for server-side operations (bypasses RLS)
// Fall back to anon key if service role key is not available
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_ANON_KEY;
const isUsingServiceRole = !!env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseKey) {
	throw new Error('Either SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY must be set');
}

if (!isUsingServiceRole) {
	console.warn('⚠️  Using SUPABASE_ANON_KEY - Storage RLS policies must be configured. Consider using SUPABASE_SERVICE_ROLE_KEY for server-side operations.');
}

const supabase = createClient(env.SUPABASE_URL, supabaseKey, {
	auth: {
		autoRefreshToken: false,
		persistSession: false
	}
});

export interface SupabaseUploadResult {
	url: string;
	path: string;
}

export interface ResponsiveImageUrls {
	thumbnail: string;
	medium: string;
	full: string;
}

/**
 * Upload a single image to Supabase Storage
 */
export async function uploadImageToSupabase(
	buffer: Buffer,
	path: string,
	bucket: string = 'profile-pictures'
): Promise<SupabaseUploadResult> {
	try {
		const { data, error } = await supabase.storage
			.from(bucket)
			.upload(path, buffer, {
				contentType: 'image/webp',
				upsert: true // Replace if file exists
			});

		if (error) {
			console.error('Supabase upload error:', error);
			console.error('Error details:', {
				message: error.message,
				statusCode: error.statusCode,
				error: error.error,
				usingServiceRole: isUsingServiceRole,
				bucket,
				path
			});
			throw new Error(`Failed to upload image: ${error.message}`);
		}

		// Get public URL
		const { data: urlData } = supabase.storage
			.from(bucket)
			.getPublicUrl(data.path);

		return {
			url: urlData.publicUrl,
			path: data.path
		};
	} catch (error) {
		console.error('Error uploading to Supabase:', error);
		throw error;
	}
}

/**
 * Upload responsive images to Supabase Storage
 */
export async function uploadResponsiveImagesToSupabase(
	images: {
		thumbnail: Buffer;
		medium: Buffer;
		full: Buffer;
	},
	basePath: string,
	bucket: string = 'profile-pictures'
): Promise<ResponsiveImageUrls> {
	try {
		const uploadPromises = [
			uploadImageToSupabase(images.thumbnail, `${basePath}_thumb.webp`, bucket),
			uploadImageToSupabase(images.medium, `${basePath}_medium.webp`, bucket),
			uploadImageToSupabase(images.full, `${basePath}_full.webp`, bucket)
		];

		const results = await Promise.all(uploadPromises);

		return {
			thumbnail: results[0].url,
			medium: results[1].url,
			full: results[2].url
		};
	} catch (error) {
		console.error('Error uploading responsive images:', error);
		throw error;
	}
}

/**
 * Delete an image from Supabase Storage
 */
export async function deleteImageFromSupabase(
	path: string,
	bucket: string = 'profile-pictures'
): Promise<void> {
	try {
		const { error } = await supabase.storage
			.from(bucket)
			.remove([path]);

		if (error) {
			console.error('Error deleting from Supabase:', error);
			throw new Error(`Failed to delete image: ${error.message}`);
		}
	} catch (error) {
		console.error('Error deleting image:', error);
		throw error;
	}
}

/**
 * Delete multiple images from Supabase Storage
 */
export async function deleteResponsiveImagesFromSupabase(
	basePath: string,
	bucket: string = 'profile-pictures'
): Promise<void> {
	try {
		const paths = [
			`${basePath}_thumb.webp`,
			`${basePath}_medium.webp`,
			`${basePath}_full.webp`
		];

		const { error } = await supabase.storage
			.from(bucket)
			.remove(paths);

		if (error) {
			console.error('Error deleting responsive images:', error);
			throw new Error(`Failed to delete images: ${error.message}`);
		}
	} catch (error) {
		console.error('Error deleting responsive images:', error);
		throw error;
	}
}

/**
 * Generate Supabase storage path for user images
 */
export function generateSupabasePath(userId: string, timestamp?: number): string {
	const ts = timestamp || Date.now();
	return `users/${userId}/${ts}`;
}

/**
 * Check if Supabase is properly configured
 */
export function isSupabaseConfigured(): boolean {
	return !!(env.SUPABASE_URL && (env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_ANON_KEY));
}

export { supabase };
