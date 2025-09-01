import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const dev = process.env.NODE_ENV === 'development';

const base = dev ? '' : '/PersonalSite';

export default {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      // Important for GitHub Pages: serve index for unknown routes via 404 fallback
      fallback: '404.html',
      strict: false
    }),
    paths: {
      base
    }
  }
};