import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  base: '/library/',
  server: {
    fs: {
      allow: ['..']
    }
  }
});
