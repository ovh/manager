import { defineConfig } from 'vite';
import { getBaseConfig } from '@ovh-ux/manager-vite-config';
import tailwindcss from 'tailwindcss';
import { dirname, join, resolve } from 'path';

const baseConfig = getBaseConfig({});

export default defineConfig({
  ...baseConfig,
  root: '',
  css: {
    postcss: {
      plugins: [tailwindcss],
    },
  },
  resolve: {
    ...baseConfig.resolve,
    alias:{
      ...baseConfig.resolve.alias,
      "@public": resolve(join(process.cwd(), 'public')),
    },
    dedupe: [
      'i18next',
      'react',
      'react-dom',
      'react-i18next',
      'react-router-dom',
      'zustand',
    ],
  },
});
