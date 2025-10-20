import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter(),
		csrf: {
			trustedOrigins: ['http://localhost:*', 'http://127.0.0.1:*', 'https://a6829cac4e5a.ngrok-free.app'] // Trust localhost origins for development
		},
		// Ensure static files are properly served in build/preview mode
		files: {
			assets: 'static'
		}
	}
};

export default config;
