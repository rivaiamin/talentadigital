import { fail, redirect } from '@sveltejs/kit';
import { mkdir, writeFile } from 'node:fs/promises';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

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
        const contactNumber = formData.get('contactNumber');
        const description = formData.get('description');
        const picture = formData.get('picture');
        
        const updates: Record<string, string> = {};
        
        if (typeof username === 'string' && username.trim() !== '') {
            if (!validateUsername(username)) {
                return fail(400, { message: 'Username tidak valid (min 3, max 31 karakter, huruf/angka saja)' });
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
            await db.update(table.user).set(updates).where(eq(table.user.id, event.locals.user.id));
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
        if (status === 'active' || status === 'inactive') {
            talentUpdates.status = status;
        }
        if (typeof location === 'string') {
            talentUpdates.location = location.trim() === '' ? '' : location.trim();
        }
        if (typeof contactNumber === 'string') {
            if (contactNumber.trim() !== '' && !/^[0-9]+$/.test(contactNumber)) {
                return fail(400, { message: 'Nomor kontak tidak valid (hanya angka)' });
            }
            talentUpdates.contactNumber = contactNumber.trim() === '' ? '' : contactNumber.trim();
        }
        if (typeof description === 'string') {
            talentUpdates.description = description.trim() === '' ? '' : description.trim();
        }

        // Handle image upload
        if (picture && picture instanceof File) {
            const blob = picture as File;
            const sizeLimit = 2 * 1024 * 1024; // 2MB
            if (blob.size > sizeLimit) {
                return fail(400, { message: 'Ukuran gambar melebihi 2MB' });
            }
            const type = blob.type;
            if (!/^image\/(png|jpe?g|webp)$/.test(type)) {
                return fail(400, { message: 'Format gambar tidak didukung' });
            }
            const arrayBuffer = await blob.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const ext = type === 'image/png' ? 'png' : type === 'image/webp' ? 'webp' : 'jpg';
            const uploadsDir = 'static/uploads';
            await ensureDir(uploadsDir);
            const fileName = `${event.locals.user.id}.${ext}`;
            const filePath = `${uploadsDir}/${fileName}`;
            await writeFile(filePath, buffer);
            talentUpdates.pictureUrl = `/uploads/${fileName}`;
        }

        if (Object.keys(talentUpdates).length > 0) {
            const [existing] = await db
                .select()
                .from(table.talent)
                .where(eq(table.talent.userId, event.locals.user.id));
            if (existing) {
                await db.update(table.talent).set({
                    ...talentUpdates,
                    // keep talent.name in sync with user.fullName if provided
                    ...(updates.fullName ? { name: updates.fullName } : {})
                }).where(eq(table.talent.id, existing.id));
            } else {
                await db.insert(table.talent).values({
                    id: event.locals.user.id,
                    userId: event.locals.user.id,
                    name: updates.fullName || event.locals.user.fullName || event.locals.user.username,
                    services: talentUpdates.services ?? JSON.stringify([]),
                    status: talentUpdates.status || 'active',
                    location: talentUpdates.location ?? null,
                    contactNumber: talentUpdates.contactNumber ?? null,
                    description: talentUpdates.description ?? null
                });
            }
        }

        return redirect(303, '/me?updated=1');
    }
};
async function ensureDir(dir: string) {
    await mkdir(dir, { recursive: true });
}

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


