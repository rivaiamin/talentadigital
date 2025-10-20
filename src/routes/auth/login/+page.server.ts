import { hash, verify } from '@node-rs/argon2';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { generateUsername } from '$lib';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
    if (event.locals.user) {
        return redirect(302, '/me');
    }
    return {};
};

export const actions: Actions = {
    login: async (event) => {
        const formData = await event.request.formData();
        const identity = formData.get('identity');
        const password = formData.get('password');

        if (!validateIdentity(identity)) {
            return fail(400, {
                message: 'Username atau nomor kontak tidak valid (min 3, max 31 karakter)'
            });
        }
        if (!validatePassword(password)) {
            return fail(400, { message: 'Kata sandi tidak valid (min 6, max 255 karakter)' });
        }

        // Try to find user by username first, then by contact number
        let results = await db.select().from(table.user).where(eq(table.user.username, identity));
        if (results.length === 0) {
            results = await db.select().from(table.user).where(eq(table.user.contactNumber, identity));
        }

        const existingUser = results.at(0);
        if (!existingUser) {
            return fail(400, { message: 'Username/nomor kontak atau kata sandi salah' });
        }

        const validPassword = await verify(existingUser.passwordHash, password, {
            memoryCost: 19456,
            timeCost: 2,
            outputLen: 32,
            parallelism: 1
        });
        if (!validPassword) {
            return fail(400, { message: 'Username/nomor kontak atau kata sandi salah' });
        }

        const sessionToken = auth.generateSessionToken();
        const session = await auth.createSession(sessionToken, existingUser.id);
        auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

        return redirect(302, '/me');
    },
    register: async (event) => {
        const formData = await event.request.formData();
        const fullName = formData.get('fullName');
        const contactNumber = formData.get('contactNumber');
        const password = formData.get('password');

        if (!validateFullName(fullName)) {
            return fail(400, { message: 'Nama lengkap tidak valid (min 2, max 100 karakter)' });
        }
        if (!validateContactNumber(contactNumber)) {
            return fail(400, { message: 'Nomor kontak tidak valid (min 10, max 15 digit)' });
        }
        if (!validatePassword(password)) {
            return fail(400, { message: 'Kata sandi tidak valid' });
        }

        const userId = generateUserId();
        const username = generateUsername(fullName);
        const passwordHash = await hash(password, {
            memoryCost: 19456,
            timeCost: 2,
            outputLen: 32,
            parallelism: 1
        });

        try {
            // Check if contact number already exists
            const existingContact = await db.select().from(table.user).where(eq(table.user.contactNumber, contactNumber));
            if (existingContact.length > 0) {
                return fail(400, { message: 'Nomor kontak sudah terdaftar' });
            }

            // Ensure username is unique by adding suffix if needed
            let finalUsername = username;
            let counter = 1;
            while (true) {
                const existing = await db.select().from(table.user).where(eq(table.user.username, finalUsername));
                if (existing.length === 0) break;
                finalUsername = `${username}${counter}`;
                counter++;
            }

            await db.insert(table.user).values({ 
                id: userId, 
                fullName, 
                username: finalUsername,
                contactNumber,
                passwordHash 
            });

            // Create initial talent profile linked to this user
            await db.insert(table.talent).values({
                id: userId, // use same id for 1:1 mapping convenience
                userId: userId,
                name: fullName,
                services: JSON.stringify([]),
                status: 'active',
                location: null,
                contactNumber: contactNumber,
                description: null
            });

            const sessionToken = auth.generateSessionToken();
            const session = await auth.createSession(sessionToken, userId);
            auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
        } catch (error) {
            console.error('Registration error:', error);
            return fail(500, { message: 'Terjadi kesalahan saat mendaftar' });
        }
        return redirect(302, '/me');
    }
};

function generateUserId() {
    const bytes = crypto.getRandomValues(new Uint8Array(15));
    const id = encodeBase32LowerCase(bytes);
    return id;
}

function validateIdentity(identity: unknown): identity is string {
    return (
        typeof identity === 'string' &&
        identity.length >= 3 &&
        identity.length <= 31
    );
}

function validatePassword(password: unknown): password is string {
    return typeof password === 'string' && password.length >= 6 && password.length <= 255;
}

function validateFullName(fullName: unknown): fullName is string {
    return typeof fullName === 'string' && fullName.length >= 2 && fullName.length <= 100;
}

function validateContactNumber(contactNumber: unknown): contactNumber is string {
    return (
        typeof contactNumber === 'string' &&
        contactNumber.length >= 10 &&
        contactNumber.length <= 15 &&
        /^[0-9]+$/.test(contactNumber)
    );
}


