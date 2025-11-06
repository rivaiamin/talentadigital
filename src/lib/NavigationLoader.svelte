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
	<div
		class="fixed top-0 left-0 right-0 z-50 h-0.5 bg-base-200/50 overflow-hidden"
		role="progressbar"
		aria-label="Loading page"
		aria-busy="true"
	>
		<div class="h-full bg-primary loading-bar shadow-lg shadow-primary/50"></div>
	</div>
{/if}

<style>
	.loading-bar {
		animation: loading-progress 1.5s ease-in-out infinite;
		width: 30%;
		transform-origin: left;
	}

	@keyframes loading-progress {
		0% {
			transform: translateX(-100%);
			opacity: 0.6;
		}
		50% {
			transform: translateX(200%);
			opacity: 1;
		}
		100% {
			transform: translateX(500%);
			opacity: 0.6;
		}
	}
</style>
