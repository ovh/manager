import { defineConfig } from 'vite';
import { getBaseConfig } from '@ovh-ux/manager-vite-config';
import { resolve } from 'path';

export default defineConfig({
  ...getBaseConfig({ isLABEU: true }),
  root: resolve(process.cwd()),
});
