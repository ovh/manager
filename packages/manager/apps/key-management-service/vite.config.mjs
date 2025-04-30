import { defineConfig } from 'vite';
import { getBaseConfig } from '@ovh-ux/manager-vite-config';
import { resolve, join } from 'path';

export default defineConfig({
  ...getBaseConfig(),
  resolve: {
    alias: {
      '@': resolve(join(process.cwd(), 'src')),
      '@secrets': resolve(join(process.cwd(), 'src/modules/secrets')),
    },
  },
  root: resolve(process.cwd()),
});
