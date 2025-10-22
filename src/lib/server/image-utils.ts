import sharp from 'sharp';
import { writeFile, ensureDir } from 'fs/promises';
import { join } from 'path';

export interface ImageOptimizationOptions {
	maxWidth?: number;
	maxHeight?: number;
	quality?: number;
	format?: 'jpeg' | 'png' | 'webp';
}

export interface OptimizedImageResult {
	buffer: Buffer;
	format: string;
	width: number;
	height: number;
	size: number;
}

/**
 * Optimize and compress an image using Sharp
 */
export async function optimizeImage(
	inputBuffer: Buffer,
	options: ImageOptimizationOptions = {}
): Promise<OptimizedImageResult> {
	const {
		maxWidth = 800,
		maxHeight = 800,
		quality = 85,
		format = 'webp'
	} = options;

	try {
		// Get image metadata
		const metadata = await sharp(inputBuffer).metadata();
		
		// Determine if resizing is needed
		const needsResize = 
			(metadata.width && metadata.width > maxWidth) ||
			(metadata.height && metadata.height > maxHeight);

		let pipeline = sharp(inputBuffer);

		// Resize if needed, maintaining aspect ratio
		if (needsResize) {
			pipeline = pipeline.resize(maxWidth, maxHeight, {
				fit: 'inside',
				withoutEnlargement: true
			});
		}

		// Convert and compress based on format
		switch (format) {
			case 'webp':
				pipeline = pipeline.webp({ quality, effort: 6 });
				break;
			case 'jpeg':
				pipeline = pipeline.jpeg({ quality, progressive: true });
				break;
			case 'png':
				pipeline = pipeline.png({ quality, progressive: true });
				break;
		}

		const optimizedBuffer = await pipeline.toBuffer();
		const optimizedMetadata = await sharp(optimizedBuffer).metadata();

		return {
			buffer: optimizedBuffer,
			format: optimizedMetadata.format || format,
			width: optimizedMetadata.width || 0,
			height: optimizedMetadata.height || 0,
			size: optimizedBuffer.length
		};
	} catch (error) {
		console.error('Image optimization failed:', error);
		throw new Error('Failed to optimize image');
	}
}

/**
 * Save optimized image to disk
 */
export async function saveOptimizedImage(
	buffer: Buffer,
	filename: string,
	uploadsDir: string
): Promise<string> {
	await ensureDir(uploadsDir);
	const filePath = join(uploadsDir, filename);
	await writeFile(filePath, buffer);
	return filePath;
}

/**
 * Generate filename with timestamp and format
 */
export function generateImageFilename(
	userId: string,
	format: string,
	timestamp?: number
): string {
	const ts = timestamp || Date.now();
	return `${userId}_${ts}.${format}`;
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
	const sizeLimit = 5 * 1024 * 1024; // 5MB limit (will be compressed)
	
	if (file.size > sizeLimit) {
		return {
			valid: false,
			error: 'Ukuran gambar melebihi 5MB'
		};
	}

	const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
	if (!allowedTypes.includes(file.type)) {
		return {
			valid: false,
			error: `Format gambar tidak didukung. Format yang diterima: JPEG, PNG, WebP. Format yang dikirim: ${file.type}`
		};
	}

	return { valid: true };
}
