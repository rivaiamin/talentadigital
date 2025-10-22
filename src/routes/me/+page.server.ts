import { fail, redirect } from '@sveltejs/kit';
import { mkdir, writeFile } from 'node:fs/promises';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { validateImageFile, generateResponsiveImages, generateResponsiveFilenames } from '$lib/server/image-utils';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/auth/login');
	}
	// Load talent profile tied to this user
	const [talent] = await db
		.select()
		.from(table.talent)
		.where(eq(table.talent.userId, event.locals.user.id));
	return { user: event.locals.user, talent };
};

export const actions: Actions = {
	logout: async (event) => {
		if (!event.locals.session) {
			return fail(401, { message: 'Tidak berwenang' });
		}
		await auth.invalidateSession(event.locals.session.id);
		auth.deleteSessionTokenCookie(event);
		return redirect(302, '/auth/login');
	},
	update: async (event) => {
		if (!event.locals.user) {
			return fail(401, { message: 'Tidak berwenang' });
		}
		const formData = await event.request.formData();
		const username = formData.get('username');
		const fullName = formData.get('fullName');
		const servicesRaw = formData.get('services');
		const status = formData.get('status');
		const location = formData.get('location');
		const portfolioUrl = formData.get('portfolioUrl');
		const contactNumber = formData.get('contactNumber');
		const description = formData.get('description');
		const pricing = formData.get('pricing');
		const picture = formData.get('picture');
		// Social media URLs
		const instagramUrl = formData.get('instagramUrl');
		const facebookUrl = formData.get('facebookUrl');
		const threadUrl = formData.get('threadUrl');
		const xUrl = formData.get('xUrl');
		const linkedinUrl = formData.get('linkedinUrl');

		const updates: Record<string, string> = {};

		if (typeof username === 'string' && username.trim() !== '') {
			if (!validateUsername(username)) {
				return fail(400, {
					message: 'Username tidak valid (min 3, max 31 karakter, huruf/angka saja)'
				});
			}
			// Check if username is already taken by another user
			const existing = await db.select().from(table.user).where(eq(table.user.username, username));
			if (existing.length > 0 && existing[0].id !== event.locals.user.id) {
				return fail(400, { message: 'Username sudah digunakan' });
			}
			updates.username = username;
		}

		if (typeof fullName === 'string' && fullName.trim() !== '') {
			if (!validateFullName(fullName)) {
				return fail(400, { message: 'Nama lengkap tidak valid (min 2, max 100 karakter)' });
			}
			updates.fullName = fullName;
		}
		// Update user first
		if (Object.keys(updates).length > 0) {
			try {
				await db.update(table.user).set(updates).where(eq(table.user.id, event.locals.user.id));
			} catch (error) {
				console.error('Error updating user:', error);
				return fail(500, { message: 'Gagal memperbarui profil pengguna' });
			}
		}

		// Build talent updates
		const talentUpdates: Record<string, string> = {};
		if (typeof servicesRaw === 'string') {
			const arr = servicesRaw
				.split(',')
				.map((s) => s.trim())
				.filter((s) => s.length > 0);
			talentUpdates.services = JSON.stringify(arr);
		}
		if (status === 'online' || status === 'offline' || status === 'hybrid') {
			talentUpdates.status = status;
		}
		if (typeof location === 'string') {
			talentUpdates.location = location.trim() === '' ? '' : location.trim();
		}
		if (typeof portfolioUrl === 'string') {
			const raw = portfolioUrl.trim();
			const normalized = raw === '' ? '' : /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
			talentUpdates.portfolioUrl = normalized;
		}
		if (typeof contactNumber === 'string') {
			// Normalize leading 0 to 62
			const normalized = contactNumber.trim().startsWith('0')
				? '62' + contactNumber.trim().slice(1)
				: contactNumber.trim();
			if (normalized !== '' && !/^[0-9]+$/.test(normalized)) {
				return fail(400, { message: 'Nomor kontak tidak valid (hanya angka)' });
			}
			talentUpdates.contactNumber = normalized === '' ? '' : normalized;
		}
		if (typeof description === 'string') {
			talentUpdates.description = description.trim() === '' ? '' : description.trim();
		}
		if (typeof pricing === 'string') {
			talentUpdates.pricing = pricing.trim() === '' ? '' : pricing.trim();
		}

		// Handle social media URLs
		const socialMediaFields = [
			{ key: 'instagramUrl', value: instagramUrl },
			{ key: 'facebookUrl', value: facebookUrl },
			{ key: 'threadUrl', value: threadUrl },
			{ key: 'xUrl', value: xUrl },
			{ key: 'linkedinUrl', value: linkedinUrl }
		];

		for (const field of socialMediaFields) {
			if (typeof field.value === 'string') {
				const raw = field.value.trim();
				const normalized = raw === '' ? '' : /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
				talentUpdates[field.key] = normalized;
			}
		}

		// Handle image upload with compression
		if (picture && picture instanceof File && picture.size > 0) {
			const blob = picture as File;
			
			// Validate image file
			const validation = validateImageFile(blob);
			if (!validation.valid) {
				return fail(400, { message: validation.error });
			}

			try {
				// Convert to buffer
				const arrayBuffer = await blob.arrayBuffer();
				const buffer = Buffer.from(arrayBuffer);

				// Generate multiple responsive image sizes
				const timestamp = Date.now();
				const responsiveImages = await generateResponsiveImages(buffer, event.locals.user.id, 85);
				const filenames = generateResponsiveFilenames(event.locals.user.id, 'webp', timestamp);
				
				// Save all image sizes
				const uploadsDir = `${process.cwd()}/static/uploads`;
				await mkdir(uploadsDir, { recursive: true });
				
				// Save thumbnail (128x128)
				await writeFile(`${uploadsDir}/${filenames.thumbnail}`, responsiveImages.thumbnail.buffer);
				
				// Save medium (400x400)
				await writeFile(`${uploadsDir}/${filenames.medium}`, responsiveImages.medium.buffer);
				
				// Save full (800x800)
				await writeFile(`${uploadsDir}/${filenames.full}`, responsiveImages.full.buffer);
				
				// Store the full size URL in the database, but we'll use responsive images in the frontend
				talentUpdates.pictureUrl = `/uploads/${filenames.full}`;
				
				// Store all sizes for responsive loading (we'll add this to the database schema later)
				// For now, we'll use the full size URL
				console.log(`Responsive images generated: ${blob.size} bytes -> ${responsiveImages.thumbnail.size + responsiveImages.medium.size + responsiveImages.full.size} bytes total`);
			} catch (error) {
				console.error('Image optimization failed:', error);
				return fail(500, { message: 'Gagal memproses gambar. Silakan coba lagi.' });
			}
		}

		if (Object.keys(talentUpdates).length > 0) {
			try {
				const [existing] = await db
					.select()
					.from(table.talent)
					.where(eq(table.talent.userId, event.locals.user.id));
				if (existing) {
					await db
						.update(table.talent)
						.set({
							...talentUpdates,
							// keep talent.name in sync with user.fullName if provided
							...(updates.fullName ? { name: updates.fullName } : {})
						})
						.where(eq(table.talent.id, existing.id));
				} else {
					await db.insert(table.talent).values({
						id: event.locals.user.id,
						userId: event.locals.user.id,
						name: updates.fullName || event.locals.user.fullName || event.locals.user.username,
						services: talentUpdates.services ?? JSON.stringify([]),
						status: talentUpdates.status || 'online',
						location: talentUpdates.location ?? null,
						contactNumber: talentUpdates.contactNumber ?? null,
						description: talentUpdates.description ?? null,
						pricing: talentUpdates.pricing ?? null,
						portfolioUrl: talentUpdates.portfolioUrl ?? null,
						instagramUrl: talentUpdates.instagramUrl ?? null,
						facebookUrl: talentUpdates.facebookUrl ?? null,
						threadUrl: talentUpdates.threadUrl ?? null,
						xUrl: talentUpdates.xUrl ?? null,
						linkedinUrl: talentUpdates.linkedinUrl ?? null
					});
				}
			} catch (error) {
				console.error('Error updating talent:', error);
				return fail(500, { message: 'Gagal memperbarui profil talenta' });
			}
		}

		return redirect(303, '/me?updated=1');
	}
};

function validateUsername(username: unknown): username is string {
	return (
		typeof username === 'string' &&
		username.length >= 3 &&
		username.length <= 31 &&
		/^[a-z0-9_-]+$/.test(username)
	);
}

function validateFullName(fullName: unknown): fullName is string {
	return typeof fullName === 'string' && fullName.length >= 2 && fullName.length <= 100;
}
