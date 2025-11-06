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
