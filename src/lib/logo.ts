import logoUrl from '$lib/assets/logo.svg';

/**
 * Get the logo URL for use in templates
 * This works in both development and production builds
 */
export function getLogoUrl(): string {
	return logoUrl;
}

/**
 * Get the logo URL for server-side use
 * This provides a fallback for server-side rendering
 */
export function getServerLogoUrl(baseUrl: string): string {
	// In production, we need to use the built asset path
	// The exact filename may change with each build, so we use a more generic approach
	return `${baseUrl}/_app/immutable/assets/logo.D6qMAGYU.svg`;
}
