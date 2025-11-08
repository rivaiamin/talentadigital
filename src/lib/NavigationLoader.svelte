<script lang="ts">
	// Try $app/stores first for consistency, fallback to $app/state for newer SvelteKit
	import { navigating } from '$app/stores';

	let isNavigating = $state(false);
	let showLoader = $state(false);

	$effect(() => {
		const navigatingValue = $navigating;
		if (navigatingValue !== null) {
			isNavigating = true;
			// Small delay to prevent flicker on fast navigations
			const timer = setTimeout(() => {
				if (isNavigating) {
					showLoader = true;
				}
			}, 150);
			return () => clearTimeout(timer);
		} else {
			// Keep loader visible briefly after navigation completes for smooth transition
			const timer = setTimeout(() => {
				showLoader = false;
				isNavigating = false;
			}, 100);
			return () => clearTimeout(timer);
		}
	});
</script>

{#if showLoader}
	<div class="fixed left-1/2 top-4 z-50 -translate-x-1/2 pointer-events-none">
		<div
			class="flex items-center gap-3 rounded-full border border-base-content/20 bg-base-100/80 px-4 py-2 shadow-lg backdrop-blur-md pointer-events-auto"
			role="status"
			aria-live="polite"
		>
			<span class="loading loading-spinner text-primary" aria-hidden="true"></span>
			<span class="text-sm font-medium text-base-content">Memuat...</span>
		</div>
	</div>
{/if}
