import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import dts from 'vite-plugin-dts';
import tailwindcss from 'tailwindcss';
import { UserConfigExport } from 'vite';
import { getBaseConfig } from '@ovh-ux/manager-vite-config';
import path from 'path';

const app = async (): Promise<UserConfigExport> => {
  return defineConfig({
    ...getBaseConfig,
    plugins: [
      react(),
      dts({
        insertTypesEntry: true,
      }),
    ],
    css: {
      postcss: {
        plugins: [tailwindcss],
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
    },
    resolve: {
      alias: {
        // Example: Adding an alias for your project or packages
        '@ovh-ux/request-tagger': path2.resolve(
          __dirname,
          '../manager/core/request-tagger/src/',
        ),
        '@ovh-ux/manager-core-sso': path.resolve(
          __dirname,
          '../manager/core/sso/src/',
        ),
        '@ovh-ux/manager-core-api': path.resolve(
          __dirname,
          '../manager/core/api/src/',
        ),
        '@ovh-ux/manager-react-shell-client': path.resolve(
          __dirname,
          '../manager/core/shell-client/src/',
        ),
        '@ovh-ux/ovh-at-internet': path.resolve(
          __dirname,
          '../components/ovh-at-internet/src',
        ),
        '@ovh-ux/shell': path.resolve(__dirname, '../components/ovh-shell/src'),
        '@ovh-ux/url-builder': path.resolve(
          __dirname,
          '../manager/core/url-builder/src',
        ),
      },
    },
  });
};

export default app;
