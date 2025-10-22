<script lang="ts">
	import type { PageData } from './$types';
	let { data } = $props<{ data: PageData }>();
	const t = data.talent;
</script>

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
			src={t.pictureUrl || '/uploads/wg44pddcfwt2hgpjwsqkyvqf.jpg'}
			alt={t.name}
			class="w-32 h-32 object-cover rounded-full mx-auto"
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

	{#if t.instagramUrl || t.twitterUrl || t.linkedinUrl || t.githubUrl || t.dribbbleUrl || t.behanceUrl}
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
				{#if t.twitterUrl}
					<a
						href={t.twitterUrl}
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
								d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"
							/>
						</svg>
						Twitter
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
				{#if t.githubUrl}
					<a
						href={t.githubUrl}
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
								d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
							/>
						</svg>
						GitHub
					</a>
				{/if}
				{#if t.dribbbleUrl}
					<a
						href={t.dribbbleUrl}
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
								d="M12 0C5.374 0 0 5.374 0 12s5.374 12 12 12 12-5.374 12-12S18.626 0 12 0zm8.568 4.568c1.875 1.875 3.432 4.406 3.432 7.432 0 1.125-.281 2.25-.75 3.281-.281.656-.656 1.312-1.125 1.875-.375.375-.75.656-1.125.937-.375.281-.75.469-1.125.656-.375.187-.75.281-1.125.375-.375.093-.75.187-1.125.187-.375 0-.75-.093-1.125-.187-.375-.093-.75-.187-1.125-.375-.375-.187-.75-.375-1.125-.656-.375-.281-.75-.562-1.125-.937-.375-.563-.75-1.219-1.125-1.875-.469-1.031-.75-2.156-.75-3.281 0-3.026 1.557-5.557 3.432-7.432z"
							/>
						</svg>
						Dribbble
					</a>
				{/if}
				{#if t.behanceUrl}
					<a
						href={t.behanceUrl}
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
								d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.465.109 1.188.095 2.14h-8.027c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h6.605c-.105-1.547-1.077-3.219-3.238-3.219-2.197 0-3.367 1.672-3.367 3.219zm-6.04 2.467h-5.5v-5.5h5.5v5.5zm-2.75-8.467c-1.242 0-2.25-1.008-2.25-2.25s1.008-2.25 2.25-2.25 2.25 1.008 2.25 2.25-1.008 2.25-2.25 2.25z"
							/>
						</svg>
						Behance
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
