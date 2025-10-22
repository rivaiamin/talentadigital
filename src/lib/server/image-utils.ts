import sharp from 'sharp';
import { writeFile, mkdir } from 'fs/promises';
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

export interface ResponsiveImageSet {
	thumbnail: OptimizedImageResult;
	medium: OptimizedImageResult;
	full: OptimizedImageResult;
}

export interface ImageSize {
	width: number;
	height: number;
	name: string;
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
	await mkdir(uploadsDir, { recursive: true });
	const filePath = join(uploadsDir, filename);
	await writeFile(filePath, buffer);
	return filePath;
}

/**
 * Generate multiple responsive image sizes
 */
export async function generateResponsiveImages(
	inputBuffer: Buffer,
	baseFilename: string,
	quality: number = 85
): Promise<ResponsiveImageSet> {
	const sizes = [
		{ width: 128, height: 128, name: 'thumbnail' },
		{ width: 400, height: 400, name: 'medium' },
		{ width: 800, height: 800, name: 'full' }
	];

	const results: Partial<ResponsiveImageSet> = {};

	for (const size of sizes) {
		const optimized = await optimizeImage(inputBuffer, {
			maxWidth: size.width,
			maxHeight: size.height,
			quality,
			format: 'webp'
		});
		
		results[size.name as keyof ResponsiveImageSet] = optimized;
	}

	return results as ResponsiveImageSet;
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
 * Generate responsive filenames for different sizes
 */
export function generateResponsiveFilenames(
	userId: string,
	format: string,
	timestamp?: number
): { thumbnail: string; medium: string; full: string } {
	const ts = timestamp || Date.now();
	const base = `${userId}_${ts}`;
	
	return {
		thumbnail: `${base}_thumb.${format}`,
		medium: `${base}_medium.${format}`,
		full: `${base}_full.${format}`
	};
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
