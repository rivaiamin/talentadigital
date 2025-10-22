/**
 * Utility functions for responsive images
 */

export interface ResponsiveImageUrls {
	thumbnail: string;
	medium: string;
	full: string;
}

/**
 * Generate responsive image URLs from a base image URL
 * This function tries to detect if the image has responsive variants
 * and generates appropriate URLs for different sizes
 */
export function generateResponsiveUrls(baseUrl: string): ResponsiveImageUrls {
	// If it's a default image (logo), return the same URL for all sizes
	if (baseUrl.includes('wg44pddcfwt2hgpjwsqkyvqf.jpg') || baseUrl.includes('logo.svg') || baseUrl.includes('logo.D6qMAGYU.svg')) {
		return {
			thumbnail: baseUrl,
			medium: baseUrl,
			full: baseUrl
		};
	}

	// Extract the base filename without extension
	const urlParts = baseUrl.split('/');
	const filename = urlParts[urlParts.length - 1];
	
	// Check if this is already a responsive image
	if (filename.includes('_thumb.') || filename.includes('_medium.') || filename.includes('_full.')) {
		// Extract the base part (everything before _thumb, _medium, or _full)
		const baseMatch = filename.match(/^(.+)_(thumb|medium|full)\.(.+)$/);
		if (baseMatch) {
			const [, base, , extension] = baseMatch;
			const basePath = urlParts.slice(0, -1).join('/');
			
			return {
				thumbnail: `${basePath}/${base}_thumb.${extension}`,
				medium: `${basePath}/${base}_medium.${extension}`,
				full: `${basePath}/${base}_full.${extension}`
			};
		}
	}

	// For legacy images or new uploads, try to generate responsive URLs
	// This assumes the base URL is the full size
	const basePath = urlParts.slice(0, -1).join('/');
	const filenameWithoutExt = filename.split('.')[0];
	const extension = filename.split('.').pop() || 'webp';

	return {
		thumbnail: `${basePath}/${filenameWithoutExt}_thumb.${extension}`,
		medium: `${basePath}/${filenameWithoutExt}_medium.${extension}`,
		full: baseUrl
	};
}

/**
 * Get the most appropriate image URL for a given display size
 */
export function getOptimalImageUrl(
	baseUrl: string,
	displayWidth: number,
	displayHeight: number
): string {
	const urls = generateResponsiveUrls(baseUrl);
	
	// Determine the best size based on display dimensions
	const maxDimension = Math.max(displayWidth, displayHeight);
	
	if (maxDimension <= 128) {
		return urls.thumbnail;
	} else if (maxDimension <= 400) {
		return urls.medium;
	} else {
		return urls.full;
	}
}

/**
 * Generate srcset string for responsive images
 */
export function generateSrcSet(baseUrl: string): string {
	const urls = generateResponsiveUrls(baseUrl);
	
	return `${urls.thumbnail} 128w, ${urls.medium} 400w, ${urls.full} 800w`;
}
