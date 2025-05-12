import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
export default defineConfig({
  plugins: [react()],
  assetsInclude: ['*.md'],
  css: {
    postcss: {
      plugins: [require('tailwindcss'), require('autoprefixer')],
    },
  },
});
