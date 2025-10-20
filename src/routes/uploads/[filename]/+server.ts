import { readFile } from 'fs/promises';
import { join } from 'path';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	const { filename } = params;
	
	// Security check: prevent directory traversal
	if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
		throw error(400, 'Invalid filename');
	}

	try {
		// Read file from static/uploads directory
		const filePath = join(process.cwd(), 'static', 'uploads', filename);
		const fileBuffer = await readFile(filePath);
		
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

		return new Response(Buffer.from(fileBuffer), {
			headers: {
				'Content-Type': contentType,
				'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
			},
		});
	} catch (err) {
		console.error(err);
		throw error(404, 'File not found');
	}
};
