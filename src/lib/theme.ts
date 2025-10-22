export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

export function getStoredTheme(): Theme | null {
	if (typeof localStorage === 'undefined') return null;
	const t = localStorage.getItem(STORAGE_KEY);
	return t === 'dark' || t === 'light' ? t : null;
}

export function getSystemTheme(): Theme {
	if (typeof window === 'undefined') return 'light';
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function applyTheme(theme: Theme) {
	if (typeof document === 'undefined') return;
	const root = document.documentElement;
	if (theme === 'dark') root.classList.add('dark');
	else root.classList.remove('dark');
	// Keep DaisyUI in sync
	root.setAttribute('data-theme', theme);
}

export function initTheme() {
	const theme = getStoredTheme() ?? 'dark';
	applyTheme(theme);
}

export function toggleTheme() {
	const current = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
	const next: Theme = current === 'dark' ? 'light' : 'dark';
	applyTheme(next);
	try {
		localStorage.setItem(STORAGE_KEY, next);
	} catch {
		// Intentionally ignore storage write errors (e.g., privacy mode)
		void 0;
	}
}
