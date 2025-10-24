<script lang="ts">
	import type { PageData } from './$types';
	import { getOptimalImageUrl, generateSrcSet } from '$lib/responsive-images';
	import { getLogoUrl } from '$lib/logo';
	let { data } = $props<{ data: PageData }>();
	const t = data.talent;
	const seo = data.seo;
	
	// Generate responsive image URLs
	const profileImageUrl = getOptimalImageUrl(t.pictureUrl || getLogoUrl(), 128, 128);
	const profileImageSrcSet = generateSrcSet(t.pictureUrl || getLogoUrl());
</script>

<svelte:head>
	<title>{seo.title}</title>
	<meta name="description" content={seo.description} />
	<meta name="keywords" content={`${t.name}, talent, digital, ${t.services?.join(', ') || ''}, ${t.location || ''}, TalentaDigital`} />
	
	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="profile" />
	<meta property="og:url" content={seo.url} />
	<meta property="og:title" content={seo.title} />
	<meta property="og:description" content={seo.description} />
	<meta property="og:image" content={seo.image} />
	<meta property="og:image:width" content="400" />
	<meta property="og:image:height" content="400" />
	<meta property="og:image:alt" content={`Foto profil ${t.name}`} />
	<meta property="og:site_name" content="TalentaDigital" />
	
	<!-- Twitter -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content={seo.url} />
	<meta property="twitter:title" content={seo.title} />
	<meta property="twitter:description" content={seo.description} />
	<meta property="twitter:image" content={seo.image} />
	<meta property="twitter:image:alt" content={`Foto profil ${t.name}`} />
	
	<!-- Additional SEO -->
	<meta name="robots" content="index, follow" />
	<meta name="author" content="TalentaDigital" />
	<link rel="canonical" href={seo.url} />
	
	<!-- Structured Data -->
	<script type="application/ld+json">
		{JSON.stringify(seo.structuredData)}
	</script>
</svelte:head>

<article class="grid gap-4">
	<a href="/talents" class="btn btn-sm btn-ghost w-fit -ml-2 inline-flex items-center gap-2">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			class="w-4 h-4"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
		>
			<path d="M15 18l-6-6 6-6" stroke-linecap="round" stroke-linejoin="round" />
		</svg>
		Kembali
	</a>
	<header class="grid gap-2 text-center">
		<img
			src={profileImageUrl}
			srcset={profileImageSrcSet}
			sizes="128px"
			alt={t.name}
			class="w-32 h-32 object-cover rounded-full mx-auto"
			fetchpriority="high"
			loading="eager"
			decoding="async"
		/>
		<h1 class="text-3xl font-semibold tracking-tight">{t.name}</h1>
		<div class="flex items-center justify-center gap-4 text-sm">
			{#if t.status === 'online'}
				<div class="tooltip tooltip-bottom" data-tip="Layanan digital/remote">
					<div class="badge badge-primary gap-1">
						<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
						</svg>
						Online
					</div>
				</div>
			{:else if t.status === 'hybrid'}
				<div class="tooltip tooltip-bottom" data-tip="Layanan digital dan tatap muka">
					<div class="badge badge-secondary gap-1">
						<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
						</svg>
						Hybrid
					</div>
				</div>
			{:else}
				<div class="tooltip tooltip-bottom" data-tip="Layanan tatap muka/lokasi">
					<div class="badge badge-accent gap-1">
						<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
						</svg>
						Offline
					</div>
				</div>
			{/if}
			{#if t.location}
				<div class="tooltip tooltip-bottom" data-tip="Lokasi talent">
					<div class="flex items-center gap-1 text-base-content/70">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-4 w-4 flex-shrink-0"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
							/>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
							/>
						</svg>
						<span class="align-middle">{t.location}</span>
					</div>
				</div>
			{/if}
		</div>
	</header>

	{#if t.services?.length}
		<section>
			<h2 class="text-xl font-medium mb-2">Layanan</h2>
			<div class="flex flex-wrap gap-2">
				{#each t.services as s}
					<span class="badge badge-outline">{s}</span>
				{/each}
			</div>
		</section>
	{/if}

	{#if t.description}
		<section>
			<h2 class="text-xl font-medium mb-2">Deskripsi</h2>
			<p class="text-base-content/80 whitespace-pre-line">{t.description}</p>
		</section>
	{/if}

	{#if t.pricing}
		<section>
			<h2 class="text-xl font-medium mb-2">Harga & Paket</h2>
			<div class="bg-base-200 rounded-lg p-4">
				<p class="text-base-content/80 whitespace-pre-line font-mono text-sm">{t.pricing}</p>
			</div>
		</section>
	{/if}

	{#if t.portfolioUrl}
		<section>
			<h2 class="text-xl font-medium mb-2">Portofolio</h2>
			<a
				href={t.portfolioUrl}
				target="_blank"
				rel="noopener noreferrer"
				class="text-link-content hover:underline">{t.portfolioUrl}</a
			>
		</section>
	{/if}

	{#if t.instagramUrl || t.facebookUrl || t.threadUrl || t.xUrl || t.linkedinUrl}
		<section>
			<h2 class="text-xl font-medium mb-2">Media Sosial</h2>
			<div class="flex flex-wrap gap-2">
				{#if t.instagramUrl}
					<a
						href={t.instagramUrl}
						target="_blank"
						rel="noopener noreferrer"
						class="btn btn-outline btn-sm"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="w-4 h-4"
							viewBox="0 0 24 24"
							fill="currentColor"
						>
							<path
								d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
							/>
						</svg>
						Instagram
					</a>
				{/if}
				{#if t.facebookUrl}
					<a
						href={t.facebookUrl}
						target="_blank"
						rel="noopener noreferrer"
						class="btn btn-outline btn-sm"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="w-4 h-4"
							viewBox="0 0 24 24"
							fill="currentColor"
						>
							<path
								d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
							/>
						</svg>
						Facebook
					</a>
				{/if}
				{#if t.threadUrl}
					<a
						href={t.threadUrl}
						target="_blank"
						rel="noopener noreferrer"
						class="btn btn-outline btn-sm"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="w-4 h-4"
							viewBox="0 0 24 24"
							fill="currentColor"
						>
							<path
								d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.5 12.068c0-3.518.85-6.372 2.495-8.423C5.845 1.205 8.598.024 12.179 0h.007c3.581.024 6.334 1.205 8.184 3.509 2.35 2.35 3.2 5.204 3.2 8.722 0 3.518-.85 6.372-2.495 8.423-1.85 2.304-4.603 3.485-8.184 3.509zM12.186 2.25c-2.734.018-4.813.732-6.187 2.106-1.374 1.374-2.088 3.453-2.106 6.187.018 2.734.732 4.813 2.106 6.187 1.374 1.374 3.453 2.088 6.187 2.106 2.734-.018 4.813-.732 6.187-2.106 1.374-1.374 2.088-3.453 2.106-6.187-.018-2.734-.732-4.813-2.106-6.187-1.374-1.374-3.453-2.088-6.187-2.106z"
							/>
						</svg>
						Thread
					</a>
				{/if}
				{#if t.xUrl}
					<a
						href={t.xUrl}
						target="_blank"
						rel="noopener noreferrer"
						class="btn btn-outline btn-sm"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="w-4 h-4"
							viewBox="0 0 24 24"
							fill="currentColor"
						>
							<path
								d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
							/>
						</svg>
						X
					</a>
				{/if}
				{#if t.linkedinUrl}
					<a
						href={t.linkedinUrl}
						target="_blank"
						rel="noopener noreferrer"
						class="btn btn-outline btn-sm"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="w-4 h-4"
							viewBox="0 0 24 24"
							fill="currentColor"
						>
							<path
								d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
							/>
						</svg>
						LinkedIn
					</a>
				{/if}
			</div>
		</section>
	{/if}

	{#if t.contactNumber}
		<section class="mt-4">
			<a
				class="btn btn-primary w-full rounded-full"
				href={`https://wa.me/${t.contactNumber}`}
				target="_blank"
				rel="noopener noreferrer">Kontak via WhatsApp</a
			>
		</section>
	{/if}
</article>
