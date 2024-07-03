import { defineConfig } from 'vite';
import { getBaseConfig } from '@ovh-ux/manager-vite-config';

const config = getBaseConfig({});

export default defineConfig({
  ...config,
  resolve: {
    ...config.resolve,
  },
});
