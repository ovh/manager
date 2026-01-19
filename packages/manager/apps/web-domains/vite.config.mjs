import { defineConfig } from 'vite';
import { getBaseConfig } from '@ovh-ux/manager-vite-config';
import { resolve } from 'path';

const baseConfig = getBaseConfig();

export default defineConfig({
  ...baseConfig,
  root: resolve(process.cwd()),
  plugins: [
    ...(baseConfig.plugins || []),
  ],
});
