import { fail, redirect } from '@sveltejs/kit';
import type { RequestEvent, Actions } from '@sveltejs/kit';
import { verify, hash } from '@node-rs/argon2';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load = async (event: RequestEvent) => {
	if (!event.locals.user) {
		return redirect(302, '/auth/login');
	}
	return {};
};

export const actions: Actions = {
	default: async (event) => {
		if (!event.locals.user) return fail(401, { message: 'Tidak berwenang' });
		const formData = await event.request.formData();
		const currentPassword = formData.get('currentPassword');
		const newPassword = formData.get('newPassword');

		if (typeof currentPassword !== 'string' || typeof newPassword !== 'string') {
			return fail(400, { message: 'Input tidak valid' });
		}
		if (newPassword.length < 6 || newPassword.length > 255) {
			return fail(400, { message: 'Panjang kata sandi baru tidak valid' });
		}

		const [user] = await db
			.select()
			.from(table.user)
			.where(eq(table.user.id, event.locals.user.id));
		if (!user) return fail(400, { message: 'Pengguna tidak ditemukan' });

		const valid = await verify(user.passwordHash, currentPassword, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});
		if (!valid) return fail(400, { message: 'Kata sandi saat ini salah' });

		const newHash = await hash(newPassword, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});
		await db.update(table.user).set({ passwordHash: newHash }).where(eq(table.user.id, user.id));
		return { success: true };
	}
};
