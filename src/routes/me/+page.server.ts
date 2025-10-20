import { fail, redirect } from '@sveltejs/kit';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
    if (!event.locals.user) {
        return redirect(302, '/auth/login');
    }
    return { user: event.locals.user };
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
        const ageRaw = formData.get('age');
        const username = formData.get('username');
        const fullName = formData.get('fullName');
        
        const age = typeof ageRaw === 'string' && ageRaw.trim() !== '' ? Number(ageRaw) : null;
        if (age !== null && (Number.isNaN(age) || age < 0 || age > 130)) {
            return fail(400, { message: 'Usia tidak valid' });
        }
        
        const updates: any = { age };
        
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
        
        await db.update(table.user).set(updates).where(eq(table.user.id, event.locals.user.id));
        return { success: true };
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


