<script lang="ts">
    import logo from '$lib/assets/favicon.svg';
</script>

<section class="min-h-[70dvh] grid place-items-center">
    <div class="w-full max-w-sm text-center mt-12">
        <div class="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-red-600/10 ring-1 ring-red-500/20">
            <img src={logo} alt="Logo" class="h-16 w-16" />
        </div>
        <h1 class="text-3xl font-semibold tracking-tight">Selamat datang</h1>
        <p class="mt-2 text-sm text-base-content/70">Temukan dan hubungkan dengan para talent terbaik.</p>

        <div class="mt-8 flex flex-col items-center gap-3">
            <a href="/demo" class="btn btn-primary btn-lg rounded-full w-48">Cari Talent</a>
            <a href="/auth/login" class="btn btn-lg rounded-full w-48 bg-base-content text-primary-content dark:text-primary border border-primary">Jadi Talent</a>
        </div>
    </div>
</section>
