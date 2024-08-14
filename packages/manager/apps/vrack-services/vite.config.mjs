import { defineConfig } from 'vite';
import { getBaseConfig } from '@ovh-ux/manager-vite-config';
import { resolve } from 'path';

const config = getBaseConfig({});

export default defineConfig({
  ...config,
  root: resolve(process.cwd()),
  resolve: {
    ...config.resolve,
  },
});
