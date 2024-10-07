import react from '@vitejs/plugin-react';
import { defineConfig, UserConfigExport } from 'vitest/config';
import tailwindcss from 'tailwindcss';
import path from 'path';

const app = async (): Promise<UserConfigExport> => {
  return defineConfig({
    plugins: [react()],
    css: {
      postcss: {
        plugins: [tailwindcss],
      },
    },
    resolve: {
      alias: {
        // Example: Adding an alias for your project or packages
        '@ovh-ux/request-tagger': path.resolve(
          __dirname,
          '../../manager/core/request-tagger/src/',
        ),
        '@ovh-ux/manager-core-sso': path.resolve(
          __dirname,
          '../../manager/core/sso/src/',
        ),
        '@ovh-ux/manager-core-api': path.resolve(
          __dirname,
          '../../manager/core/api/src/',
        ),
        '@ovh-ux/manager-react-shell-client': path.resolve(
          __dirname,
          '../../manager/core/shell-client/src/',
        ),
        '@ovh-ux/ovh-at-internet': path.resolve(
          __dirname,
          '../../components/ovh-at-internet/src',
        ),
        '@ovh-ux/shell': path.resolve(
          __dirname,
          '../../components/ovh-shell/src',
        ),
        '@ovh-ux/url-builder': path.resolve(
          __dirname,
          '../../manager/core/url-builder/src',
        ),
      },
    },
  });
};
// https://vitejs.dev/config/
export default app;
