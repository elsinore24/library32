import adapter from '@sveltejs/adapter-netlify';
// Try importing from vite-plugin-svelte instead
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Update the preprocess configuration
  preprocess: vitePreprocess(),
  
  kit: {
    adapter: adapter(),
    paths: {
      base: '/library', // This tells SvelteKit your app is at /library
      relative: false
    }
  }
};

export default config;
