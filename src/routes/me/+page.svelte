<script lang='ts'>
    import { enhance } from '$app/forms';
    import { page } from '$app/stores';
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
        <h1 class="text-3xl font-semibold tracking-tight">Halo, {data.user.fullName || data.user.username}!</h1>
        <p class="mt-1 text-sm text-base-content/70">Username: {data.user.username} • ID: {data.user.id}</p>
    </header>

    <div class="mt-6 flex items-center gap-3">
        <form method='post' action='?/logout'>
            <button class="btn rounded-full w-32 border border-primary bg-base-content dark:bg-base-content text-primary-content dark:text-primary" type="submit">Keluar</button>
        </form>
        <a href="/auth/password" class="btn btn-primary rounded-full w-32">Ubah sandi</a>
    </div>

    <section class="mt-8">
        <h2 class="text-2xl font-semibold">Profil</h2>
        {#if $page.url.searchParams.get('updated')}
            <div class="alert alert-success mt-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.5 12.75l6 6 9-13.5"/>
                </svg>
                <span>Profil berhasil disimpan</span>
            </div>
        {/if}
        
        {#if form?.message}
            <div class="alert alert-error mt-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{form.message}</span>
            </div>
        {/if}
        <form method='post' action='?/update' enctype="multipart/form-data" use:enhance class="mt-4 space-y-6 rounded-xl border border-base-300 bg-base-100 p-6 shadow">
            <div class="form-control w-full">
                <label class="label" for="fullName"><span class="label-text">Nama lengkap</span></label>
                <input id="fullName" name='fullName' value={data.user.fullName || ''} required minlength='2' maxlength='100' class="input input-bordered w-full mt-2" />
            </div>
            <div class="form-control w-full">
                <label class="label" for="username"><span class="label-text">Username</span></label>
                <input id="username" name='username' value={data.user.username} minlength='3' maxlength='31' pattern='^[a-z0-9_-]+$' class="input input-bordered w-full mt-2" />
            </div>

            <h3 class="text-xl font-semibold pt-2">Talenta</h3>
            <div class="form-control w-full">
                <label class="label" for="services"><span class="label-text">Layanan (pisahkan dengan koma)</span></label>
                <input id="services" name='services' value={(data.talent?.services ? JSON.parse(data.talent.services) : []).join(', ')} class="input input-bordered w-full mt-2" />
            </div>
            <div class="form-control w-full">
                <label class="label" for="status"><span class="label-text">Status</span></label>
                <select id="status" name='status' class="select select-bordered w-full mt-2">
                    <option value="active" selected={data.talent?.status !== 'inactive'}>Aktif</option>
                    <option value="inactive" selected={data.talent?.status === 'inactive'}>Nonaktif</option>
                </select>
            </div>
            <div class="form-control w-full">
                <label class="label" for="location"><span class="label-text">Lokasi</span></label>
                <input id="location" name='location' value={data.talent?.location || ''} class="input input-bordered w-full mt-2" />
            </div>
            <div class="form-control w-full">
                <label class="label" for="portfolioUrl"><span class="label-text">Tautan Portofolio</span></label>
                <input id="portfolioUrl" name='portfolioUrl' value={data.talent?.portfolioUrl || ''} type="url" placeholder="https://contoh.com/portofolio" class="input input-bordered w-full mt-2" />
                <p class="text-xs text-base-content/70 mt-1">Contoh: https://dribbble.com/nama, https://github.com/nama, atau situs pribadi</p>
            </div>
            
            <h3 class="text-xl font-semibold pt-4">Media Sosial</h3>
            <div class="form-control w-full">
                <label class="label" for="instagramUrl"><span class="label-text">Instagram</span></label>
                <input id="instagramUrl" name='instagramUrl' value={data.talent?.instagramUrl || ''} type="url" placeholder="https://instagram.com/username" class="input input-bordered w-full mt-2" />
            </div>
            <div class="form-control w-full">
                <label class="label" for="twitterUrl"><span class="label-text">Twitter/X</span></label>
                <input id="twitterUrl" name='twitterUrl' value={data.talent?.twitterUrl || ''} type="url" placeholder="https://twitter.com/username" class="input input-bordered w-full mt-2" />
            </div>
            <div class="form-control w-full">
                <label class="label" for="linkedinUrl"><span class="label-text">LinkedIn</span></label>
                <input id="linkedinUrl" name='linkedinUrl' value={data.talent?.linkedinUrl || ''} type="url" placeholder="https://linkedin.com/in/username" class="input input-bordered w-full mt-2" />
            </div>
            <div class="form-control w-full">
                <label class="label" for="githubUrl"><span class="label-text">GitHub</span></label>
                <input id="githubUrl" name='githubUrl' value={data.talent?.githubUrl || ''} type="url" placeholder="https://github.com/username" class="input input-bordered w-full mt-2" />
            </div>
            <div class="form-control w-full">
                <label class="label" for="dribbbleUrl"><span class="label-text">Dribbble</span></label>
                <input id="dribbbleUrl" name='dribbbleUrl' value={data.talent?.dribbbleUrl || ''} type="url" placeholder="https://dribbble.com/username" class="input input-bordered w-full mt-2" />
            </div>
            <div class="form-control w-full">
                <label class="label" for="behanceUrl"><span class="label-text">Behance</span></label>
                <input id="behanceUrl" name='behanceUrl' value={data.talent?.behanceUrl || ''} type="url" placeholder="https://behance.net/username" class="input input-bordered w-full mt-2" />
            </div>
            <div class="form-control w-full">
                <label class="label" for="contactNumber"><span class="label-text">Nomor kontak</span></label>
                <input id="contactNumber" name='contactNumber' value={data.talent?.contactNumber || data.user.contactNumber || ''} inputmode="numeric" pattern="[0-9]*" class="input input-bordered w-full mt-2" oninput={handleProfileContactInput} />
            </div>
            <div class="form-control w-full">
                <label class="label" for="description"><span class="label-text">Deskripsi</span></label>
                <textarea id="description" name='description' rows="4" class="textarea textarea-bordered w-full mt-2">{data.talent?.description || ''}</textarea>
            </div>
            <div class="form-control w-full">
                <label class="label" for="picture"><span class="label-text">Foto</span></label>
                {#if previewUrl}
                    <img src={previewUrl} alt="Pratinjau foto" class="w-24 h-24 rounded-full object-cover mt-2" />
                {:else if data.talent?.pictureUrl}
                    <img src={data.talent.pictureUrl} alt="Foto talenta" class="w-24 h-24 rounded-full object-cover mt-2" />
                {/if}
                <input id="picture" name='picture' type='file' accept='image/*' class="file-input file-input-bordered w-full mt-2" onchange={onFileChange} />
                <p class="text-xs text-base-content/70 mt-1">PNG/JPG, maks 2MB</p>
            </div>
            <div class="pt-2">
                <button class="btn btn-primary">Simpan</button>
            </div>
        </form>

    </section>
</div>


