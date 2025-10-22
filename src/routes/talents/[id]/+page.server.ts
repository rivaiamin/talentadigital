import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const id = params.id;
	const [talent] = await db.select().from(table.talent).where(eq(table.talent.id, id));
	if (!talent) throw error(404, 'Talent tidak ditemukan');
	const result = {
		...talent,
		services: talent.services ? safeParseJsonArray(talent.services) : []
	};
	return { talent: result };
};

function safeParseJsonArray(value: string) {
	try {
		const parsed = JSON.parse(value);
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
}
