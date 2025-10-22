<script lang="ts">
	import logo from '$lib/assets/logo.svg';
</script>

<section class="min-h-[70dvh] grid place-items-center">
	<div class="w-full max-w-sm text-center mt-12">
		<div
			class="mx-auto mb-6 grid h-32 w-32 place-items-center rounded-full bg-red-600/10 ring-1 ring-red-500/20"
		>
			<img src={logo} alt="Logo" class="h-16 w-16" />
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
