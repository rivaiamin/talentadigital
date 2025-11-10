<script lang="ts">
	import illustration from '$lib/assets/logo.svg';

	const { status, error } = $props<{
		status: number;
		error: Error & { message?: string };
	}>();

	const isNotFound = status === 404;

	const title = isNotFound ? 'Halaman tidak ditemukan' : 'Terjadi kesalahan';
	const description = isNotFound
		? 'Kami tidak menemukan halaman yang kamu maksud. Coba periksa kembali URL atau kembali ke halaman sebelumnya.'
		: error?.message ?? 'Terjadi kesalahan tak terduga. Silakan coba lagi beberapa saat lagi.';

	const bottomInfo = isNotFound
		? 'Jika kamu merasa ini sebuah bug, kabari kami agar bisa segera memperbaikinya.'
		: 'Tim kami telah menerima laporan dan akan segera menindaklanjutinya.';

	function handleBack() {
		if (typeof history !== 'undefined' && history.length > 1) {
			history.back();
		} else if (typeof window !== 'undefined') {
			window.location.href = '/';
		}
	}
</script>

<svelte:head>
	<title>{status} | {title}</title>
</svelte:head>

<div class="min-h-dvh flex flex-col items-center justify-center gap-10 px-6 py-12 bg-base-100 text-base-content text-center">
	<div class="space-y-3">
		<p class="text-sm font-semibold uppercase tracking-widest text-primary/80">{status}</p>
		<h1 class="text-3xl font-semibold md:text-4xl">{title}</h1>
		<p class="text-base-content/70 max-w-md mx-auto">{description}</p>
	</div>

	<img src={illustration} alt="TalentaDigital" class="h-24 w-24 md:h-28 md:w-28 opacity-90" />

	<button class="btn btn-primary px-6 font-semibold shadow-sm transition hover:scale-105" onclick={handleBack}>
		Kembali
	</button>

	<p class="mt-12 text-xs text-base-content/60 max-w-sm mx-auto">
		{bottomInfo}
	</p>
</div>

