import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  base: '/',
  site: 'https://maap-portfolio.pages.dev',
	vite: {
		plugins: [tailwindcss()],
	},
});
