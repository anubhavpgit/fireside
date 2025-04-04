import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [svelte()],
	server: {
		port: 3000,
		open: true
	},
	build: {
		outDir: 'docs'
	},
	base: 'https://anubhavp.dev/fireside/',
	resolve: {
		alias: {
			$lib: path.resolve("./src/lib"),
		},
	},
});
