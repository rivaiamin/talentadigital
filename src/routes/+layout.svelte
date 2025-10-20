<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
    import { initTheme } from '$lib/theme';
    import ThemeToggle from '$lib/ThemeToggle.svelte';
	import { onMount } from 'svelte';
    import { page } from '$app/stores';
	let { children } = $props();

	onMount(() => {
		initTheme();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<script>
		// Initialize theme immediately to prevent flash
		(function() {
				const stored = localStorage.getItem('theme');
				const theme = stored || 'dark';
				document.documentElement.classList.toggle('dark', theme === 'dark');
				document.documentElement.setAttribute('data-theme', theme);
		})();
	</script>
</svelte:head>

<div class="min-h-dvh bg-base-100 text-base-content">
    
    {#if $page.url.pathname !== '/'}
    <header class="sticky top-0 z-10  border-base-300 bg-base-100/80 backdrop-blur">
        <div class="mx-auto max-w-screen-sm px-4 py-3 flex items-center justify-between">
            <a href="/" class="font-semibold">TalentaDigital</a>
            <div class="flex items-center gap-2">
                <ThemeToggle />
                <a href="/me" class="btn btn-circle btn-sm btn-primary flex items-center gap-2" aria-label="Profil">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="2" fill="none"/>
                        <path d="M4 20c0-4 8-6 8-6s8 2 8 6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>
                    </svg>
                </a>
            </div>
        </div>
    </header>
    {/if}
    <main class="mx-auto max-w-screen-sm px-4 pt-6">
        {@render children?.()}
    </main>
    <footer class="inset-x-0 bottom-0 mx-auto max-w-screen-sm px-4 py-6 text-xs text-base-content/60 text-center z-20">
        <div>
            <a href="#" class="text-lg text-base-content/80 underline decoration-primary/60 underline-offset-4">Donasi</a>
        </div>

        <!-- Decorative elements similar to reference image -->
        <div class="flex flex-col items-center mt-6 space-y-3">
            <!-- Horizontal line with circle in center -->
            <div class="relative flex items-center justify-center w-32">
                <div class="absolute left-0 right-0 h-0.5 bg-primary"></div>
                <div class="relative w-2 h-2 bg-primary rounded-full"></div>
            </div>

            <!-- Wavy line -->
            <div class="w-32 h-1">
                <svg viewBox="0 0 128 4" class="w-full h-full">
                    <path d="M0,2 Q32,0 64,2 T128,2" stroke="hsl(var(--p))" stroke-width="2" fill="none" />
                </svg>
            </div>
        </div>

        <div class="mt-12"> 
            &copy; {new Date().getFullYear()} TalentaDigital
        </div>
    </footer>
</div>
