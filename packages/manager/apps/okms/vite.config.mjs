import { defineConfig } from 'vite';
import { getBaseConfig } from '@ovh-ux/manager-vite-config';
import { resolve, join } from 'path';

export default defineConfig({
  ...getBaseConfig(),
  resolve: {
    alias: {
      '@': resolve(join(process.cwd(), 'src')),
      '@secret-manager': resolve(
        join(process.cwd(), 'src/modules/secret-manager'),
      ),
      '@key-management-service': resolve(
        join(process.cwd(), 'src/modules/key-management-service'),
      ),
    },
    dedupe: ['@tanstack/react-virtual'],
  },
  root: resolve(process.cwd()),
});
