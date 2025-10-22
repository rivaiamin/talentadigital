import { readFile, stat } from 'fs/promises';
import { join } from 'path';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, request }) => {
	const { filename } = params;

	// Security check: prevent directory traversal
	if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
		throw error(400, 'Invalid filename');
	}

	try {
		// Read file from static/uploads directory
		const filePath = join(process.cwd(), 'static', 'uploads', filename);
		const fileBuffer = await readFile(filePath);
		const fileStats = await stat(filePath);

		// Determine content type based on file extension
		const ext = filename.split('.').pop()?.toLowerCase();
		let contentType = 'application/octet-stream';

		switch (ext) {
			case 'jpg':
			case 'jpeg':
				contentType = 'image/jpeg';
				break;
			case 'png':
				contentType = 'image/png';
				break;
			case 'webp':
				contentType = 'image/webp';
				break;
		}

		// Calculate ETag for efficient caching
		const etag = `"${fileStats.mtime.getTime()}-${fileStats.size}"`;
		
		// Check if client has cached version
		const ifNoneMatch = request.headers.get('if-none-match');
		if (ifNoneMatch === etag) {
			return new Response(null, { status: 304 });
		}

		// Set optimized cache headers
		const headers = new Headers({
			'Content-Type': contentType,
			'Cache-Control': 'public, max-age=31536000, immutable', // Cache for 1 year, immutable
			'ETag': etag,
			'Last-Modified': fileStats.mtime.toUTCString(),
			'Content-Length': fileStats.size.toString(),
			// Enable compression
			'Vary': 'Accept-Encoding',
			// Security headers
			'X-Content-Type-Options': 'nosniff',
			'X-Frame-Options': 'DENY'
		});

		// Add expires header for older browsers
		const expiresDate = new Date();
		expiresDate.setFullYear(expiresDate.getFullYear() + 1);
		headers.set('Expires', expiresDate.toUTCString());

		return new Response(Buffer.from(fileBuffer), { headers });
	} catch (err) {
		console.error(err);
		throw error(404, 'File not found');
	}
};
