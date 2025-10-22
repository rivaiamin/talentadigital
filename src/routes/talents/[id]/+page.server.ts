import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import { getServerLogoUrl } from '$lib/logo';

export const load: PageServerLoad = async ({ params, url }) => {
	const id = params.id;
	const [talent] = await db.select().from(table.talent).where(eq(table.talent.id, id));
	if (!talent) throw error(404, 'Talent tidak ditemukan');
	
	const result = {
		...talent,
		services: talent.services ? safeParseJsonArray(talent.services) : []
	};

	// Generate SEO-friendly meta data
	const baseUrl = url.origin;
	const talentUrl = `${baseUrl}/talents/${id}`;
	const imageUrl = talent.pictureUrl ? `${baseUrl}${talent.pictureUrl}` : getServerLogoUrl(baseUrl);
	
	// Create description from available data
	const services = talent.services ? safeParseJsonArray(talent.services) : [];
	const description = talent.description 
		? talent.description.slice(0, 160) + (talent.description.length > 160 ? '...' : '')
		: `Profil talent ${talent.name} di TalentaDigital. ${services.length ? `Layanan: ${services.join(', ')}.` : ''} ${talent.location ? `Berlokasi di ${talent.location}.` : ''}`;

	// Generate structured data for SEO
	const structuredData = {
		"@context": "https://schema.org",
		"@type": "Person",
		"name": talent.name,
		"description": description,
		"image": imageUrl,
		"url": talentUrl,
		"sameAs": [
			talent.instagramUrl,
			talent.facebookUrl,
			talent.threadUrl,
			talent.xUrl,
			talent.linkedinUrl,
			talent.portfolioUrl
		].filter(Boolean),
		"address": talent.location ? {
			"@type": "PostalAddress",
			"addressLocality": talent.location
		} : undefined,
		"knowsAbout": services,
		"offers": talent.pricing ? {
			"@type": "Offer",
			"description": talent.pricing
		} : undefined,
		"telephone": talent.contactNumber
	};

	return { 
		talent: result,
		seo: {
			title: `${talent.name} - Profil Talent | TalentaDigital`,
			description,
			image: imageUrl,
			url: talentUrl,
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
