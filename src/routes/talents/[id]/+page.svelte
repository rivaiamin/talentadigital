<script lang="ts">
    import type { PageData } from './$types';
    let { data } = $props<{ data: PageData }>();
    const t = data.talent;
</script>

<article class="grid gap-4">
    <a href="/talents" class="btn btn-sm btn-ghost w-fit -ml-2 inline-flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 18l-6-6 6-6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        Kembali
    </a>
    <header class="grid gap-2 text-center">
        <img src={t.pictureUrl || '/uploads/wg44pddcfwt2hgpjwsqkyvqf.jpg'} alt={t.name} class="w-32 h-32 object-cover rounded-full mx-auto" />
        <h1 class="text-3xl font-semibold tracking-tight">{t.name}</h1>
        {#if t.location}
        <div class="text-sm text-base-content/70">{t.location}</div>
        {/if}
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

    {#if t.contactNumber}
    <section class="mt-4">
        <a class="btn btn-primary w-full rounded-full" href={`https://wa.me/${t.contactNumber}`} target="_blank" rel="noopener noreferrer">Kontak via WhatsApp</a>
    </section>
    {/if}
</article>