<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { getOptimalImageUrl, generateSrcSet } from '$lib/responsive-images';
	let { data, form } = $props();
	let previewUrl = $state<string | null>(null);

	function onFileChange(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files && input.files[0] ? input.files[0] : null;
		if (previewUrl) URL.revokeObjectURL(previewUrl);
		previewUrl = file ? URL.createObjectURL(file) : null;
	}

	function normalizePhoneInput(value: string): string {
		const digitsOnly = value.replace(/\D+/g, '');
		if (digitsOnly.startsWith('0')) {
			return '62' + digitsOnly.slice(1);
		}
		return digitsOnly;
	}

	function handleProfileContactInput(event: Event) {
		const input = event.target as HTMLInputElement;
		const normalized = normalizePhoneInput(input.value);
		if (input.value !== normalized) {
			input.value = normalized;
		}
	}
</script>

<div class="max-w-screen-sm mx-auto px-4 py-6 text-base-content">
	<header>
		<h1 class="text-3xl font-semibold tracking-tight">
			Halo, {data.user.fullName || data.user.username}!
		</h1>
		<p class="mt-1 text-sm text-base-content/70">
			Username: {data.user.username} • ID: {data.user.id}
		</p>
	</header>

	<div class="mt-6 flex items-center gap-3">
		<form method="post" action="?/logout">
			<button
				class="btn rounded-full w-32 border border-primary bg-base-content dark:bg-base-content text-primary-content dark:text-primary"
				type="submit">Keluar</button
			>
		</form>
		<a href="/auth/password" class="btn btn-primary rounded-full w-32">Ubah sandi</a>
	</div>

	<section class="mt-8">
		<h2 class="text-2xl font-semibold">Profil</h2>
		{#if $page.url.searchParams.get('updated')}
			<div class="alert alert-success mt-3">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="stroke-current shrink-0 h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4.5 12.75l6 6 9-13.5"
					/>
				</svg>
				<span>Profil berhasil disimpan</span>
			</div>
		{/if}

		{#if form?.message}
			<div class="alert alert-error mt-3">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="stroke-current shrink-0 h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
				<span>{form.message}</span>
			</div>
		{/if}
		<form
			method="post"
			action="?/update"
			enctype="multipart/form-data"
			use:enhance
			class="mt-4 space-y-6 rounded-xl border border-base-300 bg-base-100 p-6 shadow"
		>
			<div class="form-control w-full">
				<label class="label" for="fullName"><span class="label-text">Nama lengkap</span></label>
				<input
					id="fullName"
					name="fullName"
					value={data.user.fullName || ''}
					required
					minlength="2"
					maxlength="100"
					class="input input-bordered w-full mt-2"
				/>
			</div>
			<div class="form-control w-full">
				<label class="label" for="username"><span class="label-text">Username</span></label>
				<input
					id="username"
					name="username"
					value={data.user.username}
					minlength="3"
					maxlength="31"
					pattern="^[a-z0-9_-]+$"
					class="input input-bordered w-full mt-2"
				/>
			</div>

			<h3 class="text-xl font-semibold pt-2">Talenta</h3>
			<div class="form-control w-full">
				<label class="label" for="services"
					><span class="label-text">Layanan (pisahkan dengan koma)</span></label
				>
				<input
					id="services"
					name="services"
					value={(data.talent?.services ? JSON.parse(data.talent.services) : []).join(', ')}
					class="input input-bordered w-full mt-2"
				/>
			</div>
			<div class="form-control w-full">
				<label class="label" for="status"><span class="label-text">Tipe Jasa</span></label>
				<select id="status" name="status" class="select select-bordered w-full mt-2">
					<option value="online" selected={data.talent?.status === 'online'}>Online</option>
					<option value="offline" selected={data.talent?.status === 'offline'}>Offline</option>
					<option value="hybrid" selected={data.talent?.status === 'hybrid'}>Hybrid</option>
				</select>
			</div>
			<div class="form-control w-full">
				<label class="label" for="location"><span class="label-text">Lokasi</span></label>
				<input
					id="location"
					name="location"
					value={data.talent?.location || ''}
					class="input input-bordered w-full mt-2"
				/>
			</div>
			<div class="form-control w-full">
				<label class="label" for="portfolioUrl"
					><span class="label-text">Tautan Portofolio</span></label
				>
				<input
					id="portfolioUrl"
					name="portfolioUrl"
					value={data.talent?.portfolioUrl || ''}
					type="url"
					placeholder="https://contoh.com/portofolio"
					class="input input-bordered w-full mt-2"
				/>
				<p class="text-xs text-base-content/70 mt-1">
					Contoh: https://dribbble.com/nama, https://github.com/nama, atau situs pribadi
				</p>
			</div>

			<h3 class="text-xl font-semibold pt-4">Media Sosial</h3>
			<div class="form-control w-full">
				<label class="label" for="instagramUrl"><span class="label-text">Instagram</span></label>
				<input
					id="instagramUrl"
					name="instagramUrl"
					value={data.talent?.instagramUrl || ''}
					type="url"
					placeholder="https://instagram.com/username"
					class="input input-bordered w-full mt-2"
				/>
			</div>
			<div class="form-control w-full">
				<label class="label" for="facebookUrl"><span class="label-text">Facebook</span></label>
				<input
					id="facebookUrl"
					name="facebookUrl"
					value={data.talent?.facebookUrl || ''}
					type="url"
					placeholder="https://facebook.com/username"
					class="input input-bordered w-full mt-2"
				/>
			</div>
			<div class="form-control w-full">
				<label class="label" for="threadUrl"><span class="label-text">Thread</span></label>
				<input
					id="threadUrl"
					name="threadUrl"
					value={data.talent?.threadUrl || ''}
					type="url"
					placeholder="https://threads.net/@username"
					class="input input-bordered w-full mt-2"
				/>
			</div>
			<div class="form-control w-full">
				<label class="label" for="xUrl"><span class="label-text">X</span></label>
				<input
					id="xUrl"
					name="xUrl"
					value={data.talent?.xUrl || ''}
					type="url"
					placeholder="https://x.com/username"
					class="input input-bordered w-full mt-2"
				/>
			</div>
			<div class="form-control w-full">
				<label class="label" for="linkedinUrl"><span class="label-text">LinkedIn</span></label>
				<input
					id="linkedinUrl"
					name="linkedinUrl"
					value={data.talent?.linkedinUrl || ''}
					type="url"
					placeholder="https://linkedin.com/in/username"
					class="input input-bordered w-full mt-2"
				/>
			</div>
			<div class="form-control w-full">
				<label class="label" for="contactNumber"><span class="label-text">Nomor kontak</span></label
				>
				<input
					id="contactNumber"
					name="contactNumber"
					value={data.talent?.contactNumber || data.user.contactNumber || ''}
					inputmode="numeric"
					pattern="[0-9]*"
					class="input input-bordered w-full mt-2"
					oninput={handleProfileContactInput}
				/>
			</div>
			<div class="form-control w-full">
				<label class="label" for="description"><span class="label-text">Deskripsi</span></label>
				<textarea
					id="description"
					name="description"
					rows="4"
					class="textarea textarea-bordered w-full mt-2">{data.talent?.description || ''}</textarea
				>
			</div>
			<div class="form-control w-full">
				<label class="label" for="pricing"><span class="label-text">Harga & Paket</span></label>
				<textarea
					id="pricing"
					name="pricing"
					rows="6"
					placeholder="Contoh:&#10;&#10;📦 Paket Basic - Rp 500.000&#10;• Logo design&#10;• 2 revisi&#10;• File PNG & JPG&#10;&#10;📦 Paket Premium - Rp 1.500.000&#10;• Logo design&#10;• Brand identity&#10;• 5 revisi&#10;• File AI, PNG, JPG&#10;• Style guide&#10;&#10;💬 Konsultasi gratis untuk proyek custom"
					class="textarea textarea-bordered w-full mt-2">{data.talent?.pricing || ''}</textarea
				>
				<p class="text-xs text-base-content/70 mt-1">
					Anda bisa menggunakan emoji, bullet points, dan format teks untuk membuat daftar harga yang menarik
				</p>
			</div>
			<div class="form-control w-full">
				<label class="label" for="picture"><span class="label-text">Foto</span></label>
				{#if previewUrl}
					<img
						src={previewUrl}
						alt="Pratinjau foto"
						class="w-24 h-24 rounded-full object-cover mt-2"
					/>
				{:else if data.talent?.pictureUrl}
					<img
						src={getOptimalImageUrl(data.talent.pictureUrl, 96, 96)}
						srcset={generateSrcSet(data.talent.pictureUrl)}
						sizes="96px"
						alt="Foto talenta"
						class="w-24 h-24 rounded-full object-cover mt-2"
					/>
				{/if}
				<input
					id="picture"
					name="picture"
					type="file"
					accept="image/*"
					class="file-input file-input-bordered w-full mt-2"
					onchange={onFileChange}
				/>
				<p class="text-xs text-base-content/70 mt-1">PNG/JPG/WebP, maks 5MB (akan dikompresi otomatis)</p>
			</div>
			<div class="pt-2">
				<button class="btn btn-primary">Simpan</button>
			</div>
		</form>
	</section>
</div>
