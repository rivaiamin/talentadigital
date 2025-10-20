<script lang="ts">
    import { toggleTheme } from '$lib/theme';
</script>

<button
    class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-base-300 bg-base-100 shadow hover:bg-base-200 active:translate-y-px"
    onclick={toggleTheme}
    aria-label="Toggle theme"
>
    <span class="[&>svg]:h-4 [&>svg]:w-4">
        <svg class="hidden dark:block" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21.64 13A9 9 0 1111 2.36 7 7 0 1021.64 13z"/></svg>
        <svg class="block dark:hidden" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.76 4.84l-1.8-1.79L3.17 4.84l1.79 1.79 1.8-1.79zM1 13h3v-2H1v2zm10 10h2v-3h-2v3zm9-10v-2h-3v2h3zm-3.76 6.16l1.8 1.79 1.79-1.79-1.79-1.79-1.8 1.79zM12 6a6 6 0 100 12 6 6 0 000-12zm7.66-1.16l1.79-1.8-1.79-1.79-1.79 1.79 1.79 1.8z"/></svg>
    </span>
</button>


