import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss],
    },
  },
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    sourcemap: 'hidden',
  },
});
