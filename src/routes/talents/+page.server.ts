import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';
import { and, eq, like, or, sql } from 'drizzle-orm';
import { getServerLogoUrl } from '$lib/logo';

type Filters = {
	q: string | null;
	service: string | null;
	location: string | null;
	status: 'online' | 'offline' | 'hybrid' | null;
	page: number;
	pageSize: number;
};

export const load: PageServerLoad = async ({ url }) => {
	const filters: Filters = {
		q: url.searchParams.get('q'),
		service: url.searchParams.get('service'),
		location: url.searchParams.get('location'),
		status: (url.searchParams.get('status') as 'online' | 'offline' | 'hybrid' | null) ?? null,
		page: Math.max(1, Number(url.searchParams.get('page') || '1')),
		pageSize: Math.min(50, Math.max(1, Number(url.searchParams.get('pageSize') || '10')))
	};

	const conditions = [] as Array<
		ReturnType<typeof and> | ReturnType<typeof or> | ReturnType<typeof eq> | ReturnType<typeof like>
	>;

	// Default to show online and hybrid talents unless status provided
	if (filters.status) {
		conditions.push(eq(table.talent.status, filters.status));
	} else {
		conditions.push(or(eq(table.talent.status, 'online'), eq(table.talent.status, 'hybrid')));
	}

	if (filters.q && filters.q.trim() !== '') {
		const pattern = `%${filters.q.trim()}%`;
		conditions.push(
			or(
				like(table.talent.name, pattern),
				like(table.talent.description, pattern),
				like(table.talent.services, pattern),
				like(table.talent.location, pattern)
			)
		);
	}

	if (filters.service && filters.service.trim() !== '') {
		// services stored as JSON string, use LIKE for simple contains
		const servicePattern = `%${filters.service.trim()}%`;
		conditions.push(like(table.talent.services, servicePattern));
	}

	if (filters.location && filters.location.trim() !== '') {
		const locPattern = `%${filters.location.trim()}%`;
		conditions.push(like(table.talent.location, locPattern));
	}

	const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

	const offset = (filters.page - 1) * filters.pageSize;

	const [{ count }] = await db
		.select({ count: sql<number>`count(*)` })
		.from(table.talent)
		.where(whereClause as any);

	const rows = await db
		.select()
		.from(table.talent)
		.where(whereClause as any)
		.limit(filters.pageSize)
		.offset(offset);

	const talents = rows.map((t) => ({
		...t,
		services: t.services ? (safeParseJsonArray(t.services) as string[]) : []
	}));

	const total = Number(count || 0);
	const totalPages = Math.max(1, Math.ceil(total / filters.pageSize));

	// Generate SEO data for talents listing
	const baseUrl = url.origin;
	const currentUrl = `${baseUrl}/talents`;
	
	// Create dynamic description based on filters
	let description = 'Temukan talent digital terbaik di TalentaDigital.';
	if (filters.q) {
		description += ` Cari "${filters.q}" - `;
	}
	if (filters.service) {
		description += ` Layanan: ${filters.service}.`;
	}
	if (filters.location) {
		description += ` Lokasi: ${filters.location}.`;
	}
	description += ` ${total} talent tersedia.`;

	const structuredData = {
		"@context": "https://schema.org",
		"@type": "ItemList",
		"name": "Daftar Talent Digital",
		"description": description,
		"url": currentUrl,
		"numberOfItems": total,
		"itemListElement": talents.slice(0, 10).map((talent, index) => ({
			"@type": "ListItem",
			"position": index + 1,
			"item": {
				"@type": "Person",
				"name": talent.name,
				"description": talent.description?.slice(0, 100) || `Talent digital ${talent.name}`,
				"url": `${baseUrl}/talents/${talent.id}`,
				"image": talent.pictureUrl ? `${baseUrl}${talent.pictureUrl}` : getServerLogoUrl(baseUrl),
				"address": talent.location ? {
					"@type": "PostalAddress",
					"addressLocality": talent.location
				} : undefined,
				"knowsAbout": talent.services
			}
		}))
	};

	return {
		talents,
		page: filters.page,
		pageSize: filters.pageSize,
		total,
		totalPages,
		filters: {
			q: filters.q || '',
			service: filters.service || '',
			location: filters.location || '',
			status: filters.status || 'online'
		},
		seo: {
			title: filters.q 
				? `Cari "${filters.q}" - Talenta Digital | TalentaDigital`
				: 'Daftar Talent Digital | TalentaDigital',
			description,
			url: currentUrl,
			structuredData
		}
	};
};

function safeParseJsonArray(value: string) {
	try {
		const parsed = JSON.parse(value);
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
}
