<script lang="ts">
	import { enhance } from '$app/forms';
	import ThemeToggle from '$lib/ThemeToggle.svelte';
	let { form } = $props();
</script>

<svelte:head>
	<title>Ubah Kata Sandi - TalentaDigital</title>
</svelte:head>

<div class="min-h-dvh bg-base-100">
	<!-- Header with theme toggle -->
	<header class="sticky top-0 z-50 bg-base-100/80 backdrop-blur border-b border-base-300">
		<div class="max-w-screen-sm mx-auto px-4 py-3 flex justify-between items-center">
			<h1 class="text-xl font-semibold text-base-content">TalentaDigital</h1>
			<ThemeToggle />
		</div>
	</header>

	<!-- Main content -->
	<main class="max-w-screen-sm mx-auto px-4 py-6">
		<div class="grid place-items-center min-h-[70dvh]">
			<div class="w-full max-w-md">
				<div class="bg-base-200 rounded-lg p-6 shadow-sm">
					<h2 class="text-2xl font-semibold text-base-content mb-6 text-center">Ubah Kata Sandi</h2>
					<form method="post" use:enhance class="space-y-4">
						<div class="form-control">
							<label class="label" for="currentPassword">
								<span class="label-text text-base-content">Kata sandi saat ini</span>
							</label>
							<input
								id="currentPassword"
								name="currentPassword"
								type="password"
								class="input input-bordered bg-base-100 text-base-content placeholder-base-content/50"
								placeholder="Masukkan kata sandi saat ini"
							/>
						</div>
						<div class="form-control">
							<label class="label" for="newPassword">
								<span class="label-text text-base-content">Kata sandi baru</span>
							</label>
							<input
								id="newPassword"
								name="newPassword"
								type="password"
								class="input input-bordered bg-base-100 text-base-content placeholder-base-content/50"
								placeholder="Masukkan kata sandi baru"
							/>
						</div>
						<button class="btn btn-primary btn-lg rounded-full w-full" type="submit">
							Perbarui
						</button>
					</form>

					{#if form?.message}
						<div class="alert alert-error mt-4">
							<span class="text-sm">{form.message}</span>
						</div>
					{/if}
				</div>

				<!-- Back link -->
				<div class="text-center mt-6">
					<a href="/auth/login" class="link link-primary text-sm"> ← Kembali ke halaman masuk </a>
				</div>
			</div>
		</div>
	</main>
</div>
