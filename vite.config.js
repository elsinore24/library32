import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  // Don't include base here, it's managed by SvelteKit's config
  server: {
    fs: {
      allow: ['..']
    }
  }
});
