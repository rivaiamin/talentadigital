<script lang="ts">
    import type { PageData } from './$types';
    let { data } = $props<{ data: PageData }>();
    let q = data.filters.q;
    let service = data.filters.service;
    let location = data.filters.location;
    let status = data.filters.status;

    function onSubmit(e: Event) {
        // no-op handled by GET form action
    }
</script>

<section class="grid gap-4">
    <h1 class="text-3xl font-semibold tracking-tight">Cari Talenta</h1>

    <form method="GET" on:submit={onSubmit} class="grid gap-3 bg-base-200/60 rounded-xl p-3">
        <input name="q" value={q} placeholder="Cari nama, deskripsi, layanan" class="input input-bordered w-full" />
        <div class="grid grid-cols-2 gap-3">
            <input name="service" value={service} placeholder="Layanan (mis. desain)" class="input input-bordered w-full" />
            <input name="location" value={location} placeholder="Lokasi (mis. Jakarta)" class="input input-bordered w-full" />
        </div>
        <div class="flex items-center gap-3">
            <select name="status" bind:value={status} class="select select-bordered">
                <option value="active">Aktif</option>
                <option value="inactive">Tidak Aktif</option>
            </select>
            <button class="btn btn-primary">Cari</button>
        </div>
    </form>

    {#if data.talents.length === 0}
        <div class="text-base-content/70">Tidak ada hasil.</div>
    {:else}
        <ul class="grid gap-3">
            {#each data.talents as t}
            <li class="bg-base-200 rounded-xl p-3 flex gap-3">
                <img src={t.pictureUrl || '/uploads/wg44pddcfwt2hgpjwsqkyvqf.jpg'} alt={t.name} class="w-16 h-16 object-cover rounded-lg" loading="lazy" />
                <div class="flex-1 min-w-0">
                    <a class="font-semibold hover:underline" href={`/talents/${t.id}`}>{t.name}</a>
                    <div class="text-sm text-base-content/70 truncate">{t.description}</div>
                    {#if t.services?.length}
                    <div class="mt-2 flex flex-wrap gap-2">
                        {#each t.services as s}
                        <span class="badge badge-outline">{s}</span>
                        {/each}
                    </div>
                    {/if}
                    {#if t.location}
                    <div class="text-xs text-base-content/60 mt-1">{t.location}</div>
                    {/if}
                </div>
            </li>
            {/each}
        </ul>

        <div class="flex items-center justify-between mt-4">
            <a class="btn btn-sm" href={`?${new URLSearchParams({ ...data.filters, page: String(Math.max(1, data.page - 1)) }).toString()}`}>Sebelumnya</a>
            <div class="text-sm text-base-content/70">Hal {data.page} dari {data.totalPages} ({data.total} hasil)</div>
            <a class="btn btn-sm" href={`?${new URLSearchParams({ ...data.filters, page: String(Math.min(data.totalPages, data.page + 1)) }).toString()}`}>Berikutnya</a>
        </div>
    {/if}
    
</section>


