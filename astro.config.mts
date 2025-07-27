import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
	site: 'https://maap-portfolio.pages.dev/',
	base: 'maap-portfolio',
	vite: {
		plugins: [tailwindcss()],
	},
});
