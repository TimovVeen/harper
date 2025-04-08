import path from 'path';
import { crx } from '@crxjs/vite-plugin';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import copy from 'rollup-plugin-copy';
import sveltePreprocess from 'svelte-preprocess';
import { defineConfig } from 'vite';
import manifest from './src/manifest';

export default defineConfig(({ mode }) => {
	const production = mode === 'production';

	return {
		build: {
			emptyOutDir: true,
			outDir: 'build',
			rollupOptions: {
				output: {
					chunkFileNames: 'assets/chunk-[hash].js',
				},
			},
		},
		plugins: [
			copy({
				targets: [
					{
						src: '../harper.js/dist/harper_wasm_bg.wasm',
						dest: './build/wasm',
					},
				],
			}),
			crx({ manifest }),
			svelte({
				compilerOptions: {
					dev: !production,
				},
				preprocess: sveltePreprocess(),
			}),
		],
		resolve: {
			alias: {
				'@': path.resolve(__dirname, 'src'),
			},
		},
		legacy: {
			skipWebSocketTokenCheck: true,
		},
	};
});
