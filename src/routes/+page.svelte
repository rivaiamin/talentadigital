<script lang="ts">
	import logo from '$lib/assets/logo.svg';
	import { page } from '$app/stores';
	
	// Generate SEO data for home page
	const seo = {
		title: 'TalentaDigital - Platform Talent Digital Indonesia',
		description: 'Temukan talent digital terbaik di Indonesia. Platform untuk mencari dan menyediakan jasa digital seperti desain, programming, marketing, dan layanan digital lainnya.',
		url: $page.url.origin,
		structuredData: {
			"@context": "https://schema.org",
			"@type": "WebSite",
			"name": "TalentaDigital",
			"description": "Platform talent digital Indonesia untuk mencari dan menyediakan jasa digital",
			"url": $page.url.origin,
			"potentialAction": {
				"@type": "SearchAction",
				"target": {
					"@type": "EntryPoint",
					"urlTemplate": `${$page.url.origin}/talents?q={search_term_string}`
				},
				"query-input": "required name=search_term_string"
			}
		}
	};
</script>

<svelte:head>
	<title>{seo.title}</title>
	<meta name="description" content={seo.description} />
	<meta name="keywords" content="talent digital, freelancer, jasa digital, platform talent, Indonesia, desain, programming, marketing digital, TalentaDigital" />
	
	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content={seo.url} />
	<meta property="og:title" content={seo.title} />
	<meta property="og:description" content={seo.description} />
	<meta property="og:site_name" content="TalentaDigital" />
	
	<!-- Twitter -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content={seo.url} />
	<meta property="twitter:title" content={seo.title} />
	<meta property="twitter:description" content={seo.description} />
	
	<!-- Additional SEO -->
	<meta name="robots" content="index, follow" />
	<meta name="author" content="TalentaDigital" />
	<link rel="canonical" href={seo.url} />
	
	<!-- Structured Data -->
	<script type="application/ld+json">
		{JSON.stringify(seo.structuredData)}
	</script>
</svelte:head>

<section class="min-h-[70dvh] grid place-items-center">
	<div class="w-full max-w-sm text-center mt-12">
		<div
			class="mx-auto mb-6 grid h-32 w-32 place-items-center rounded-full bg-red-600/10 ring-1 ring-red-500/20"
		>
			<img src={logo} alt="Logo" class="h-16 w-16" fetchpriority="high" />
		</div>
		<h1 class="text-3xl font-semibold tracking-tight">TALENTA DIGITAL</h1>
		<p class="mt-2 text-sm text-base-content/70">nyari jasa apa saja? disini tempatnya!</p>

		<div class="mt-8 flex flex-col items-center gap-3">
			<a href="/talents" class="btn btn-primary btn-lg rounded-full w-48">Cari Talent</a>
			<a
				href="/auth/login"
				class="btn btn-lg rounded-full w-48 bg-base-content text-primary-content dark:text-primary border border-primary"
				>Jadi Talent</a
			>
		</div>
	</div>
</section>
