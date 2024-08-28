import { defineConfig } from 'vite';
import { getBaseConfig } from '@ovh-ux/manager-vite-config';
import tailwindcss from 'tailwindcss';

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
    dedupe: [
      'i18next',
      'react',
      'react-dom',
      'react-i18next',
      'react-router-dom',
      'zustand',
      '@ovh-ux/manager-react-components',
      '@ovh-ux/manager-react-shell-client',
    ],
  },
});
