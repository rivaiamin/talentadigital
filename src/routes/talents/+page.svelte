<script lang="ts">
	import type { PageData } from './$types';
	let { data } = $props<{ data: PageData }>();
	let q = $state(data.filters.q);
	let service = $state(data.filters.service);
	let location = $state(data.filters.location);
	let status = $state(data.filters.status);

	function onSubmit(e: Event) {
		// no-op handled by GET form action
	}
</script>

<svelte:head>
	<title>{data.seo.title}</title>
	<meta name="description" content={data.seo.description} />
	<meta name="keywords" content="talent digital, freelancer, jasa digital, TalentaDigital, layanan digital, remote work" />
	
	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content={data.seo.url} />
	<meta property="og:title" content={data.seo.title} />
	<meta property="og:description" content={data.seo.description} />
	<meta property="og:site_name" content="TalentaDigital" />
	
	<!-- Twitter -->
	<meta property="twitter:card" content="summary" />
	<meta property="twitter:url" content={data.seo.url} />
	<meta property="twitter:title" content={data.seo.title} />
	<meta property="twitter:description" content={data.seo.description} />
	
	<!-- Additional SEO -->
	<meta name="robots" content="index, follow" />
	<meta name="author" content="TalentaDigital" />
	<link rel="canonical" href={data.seo.url} />
	
	<!-- Structured Data -->
	<script type="application/ld+json">
		{JSON.stringify(data.seo.structuredData)}
	</script>
</svelte:head>

<section class="grid gap-4">
	<h1 class="text-3xl font-semibold tracking-tight">Cari Talenta</h1>

	<form method="GET" onsubmit={onSubmit} class="grid gap-3 bg-base-200/60 rounded-xl p-3">
		<input
			name="q"
			value={q}
			placeholder="Cari nama, deskripsi, layanan"
			class="input input-bordered w-full"
		/>
		<div class="grid grid-cols-2 gap-3">
			<input
				name="service"
				value={service}
				placeholder="Layanan (mis. desain)"
				class="input input-bordered w-full"
			/>
			<input
				name="location"
				value={location}
				placeholder="Lokasi (mis. Jakarta)"
				class="input input-bordered w-full"
			/>
		</div>
		<div class="flex items-center gap-3">
			<select name="status" bind:value={status} class="select select-bordered">
				<option value="online">Online</option>
				<option value="offline">Offline</option>
				<option value="hybrid">Hybrid</option>
			</select>
			<button class="btn btn-primary">Cari</button>
		</div>
	</form>

	{#if data.talents.length === 0}
		<div class="text-base-content/70">Tidak ada hasil.</div>
	{:else}
		<ul class="grid gap-3">
			{#each data.talents as t, index}
				<li class="bg-base-200 rounded-xl p-3 flex gap-3 max-w-full" style="max-width:100%;">
					<img
						src={t.pictureUrl || '/uploads/wg44pddcfwt2hgpjwsqkyvqf.jpg'}
						alt={t.name}
						class="w-16 h-16 object-cover rounded-lg flex-shrink-0"
						loading={index < 3 ? "eager" : "lazy"}
						fetchpriority={index < 3 ? "high" : "auto"}
						style="max-width:4rem;max-height:4rem;"
					/>
					<div class="flex-1 min-w-0 max-w-full" style="max-width:100%;">
						<div class="flex items-center gap-2 mb-1">
							<a
								class="font-semibold hover:underline block max-w-full truncate"
								href={`/talents/${t.id}`}>{t.name}</a
							>
							{#if t.status === 'online'}
								<div class="tooltip tooltip-bottom" data-tip="Layanan digital/remote">
									<div class="badge badge-primary gap-1 text-xs">
										<svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
										</svg>
										Online
									</div>
								</div>
							{:else if t.status === 'hybrid'}
								<div class="tooltip tooltip-bottom" data-tip="Layanan digital dan tatap muka">
									<div class="badge badge-secondary gap-1 text-xs">
										<svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
										</svg>
										Hybrid
									</div>
								</div>
							{:else}
								<div class="tooltip tooltip-bottom" data-tip="Layanan tatap muka/lokasi">
									<div class="badge badge-accent gap-1 text-xs">
										<svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
										</svg>
										Offline
									</div>
								</div>
							{/if}
						</div>
						<div class="text-sm text-base-content/70 break-words max-w-full">{t.description}</div>
						{#if t.services?.length}
							<div class="mt-2 flex flex-wrap gap-2 max-w-full" style="overflow-x:auto;">
								{#each t.services as s}
									<span class="badge badge-outline max-w-full truncate">{s}</span>
								{/each}
							</div>
						{/if}
						{#if t.location}
							<div class="tooltip tooltip-bottom" data-tip="Lokasi talent">
								<div
									class="text-xs text-base-content/60 mt-1 max-w-full truncate flex items-center gap-2"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-4 w-4"
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
									<span class="max-w-full truncate">{t.location}</span>
								</div>
							</div>
						{/if}
					</div>
				</li>
			{/each}
		</ul>

		<div class="flex items-center justify-between mt-4">
			<a
				class="btn btn-sm"
				href={`?${new URLSearchParams({ ...data.filters, page: String(Math.max(1, data.page - 1)) }).toString()}`}
				>Sebelumnya</a
			>
			<div class="text-sm text-base-content/70">
				Hal {data.page} dari {data.totalPages} ({data.total} hasil)
			</div>
			<a
				class="btn btn-sm"
				href={`?${new URLSearchParams({ ...data.filters, page: String(Math.min(data.totalPages, data.page + 1)) }).toString()}`}
				>Berikutnya</a
			>
		</div>
	{/if}
</section>
