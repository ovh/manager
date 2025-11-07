import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import { createRequire } from 'node:module';
import path from 'path';

const require = createRequire(import.meta.url);
export default defineConfig({
  plugins: [react()],
  assetsInclude: ['*.md'],
  resolve: {
    alias: {
      '@ovh-ux/muk/src': path.resolve(__dirname, '../../manager-ui-kit/src'),
      '@': path.resolve(__dirname, '../../manager-ui-kit/src'),
    },
  },
  css: {
    postcss: {
      plugins: [require('tailwindcss'), require('autoprefixer')],
    },
  },
});
