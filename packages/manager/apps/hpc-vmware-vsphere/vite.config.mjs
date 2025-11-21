import { defineConfig } from 'vite';
import { getBaseConfig } from '@ovh-ux/manager-vite-config';
import { resolve } from 'path';

const baseConfig = getBaseConfig({});

export default defineConfig({
  ...baseConfig,
  resolve: {
    ...baseConfig.resolve,
    dedupe: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-virtual',
      '@tanstack/react-query',
      '@ovh-ux/manager-core-api',
      '@ovh-ux/manager-react-shell-client',
    ],
  },
  root: resolve(process.cwd()),
});