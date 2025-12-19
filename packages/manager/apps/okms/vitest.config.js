import path from 'path';
import {
  sharedConfig,
  mergeConfig,
  createConfig,
  defaultExcludedFiles,
} from '@ovh-ux/manager-tests-setup';

export default mergeConfig(
  sharedConfig,
  createConfig({
    test: {
      setupFiles: './src/setupTests.tsx',
      server: {
        deps: {
          // Inline @ovh-ux/logs-to-customer packages to fix ESM resolution issues
          // (missing .js extensions in compiled output)
          inline: [/@ovh-ux\/logs-to-customer/],
        },
      },
      coverage: {
        exclude: [
          ...defaultExcludedFiles,
          // App-specific exclusions (not in shared config):
          'src/types',
          'src/tracking.constant.ts',
          'src/queryClient.ts',
          'src/**/*.spec.ts',
          'src/**/*.spec.tsx',
        ],
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@secret-manager': path.resolve(
          __dirname,
          'src/modules/secret-manager',
        ),
        '@key-management-service': path.resolve(
          __dirname,
          'src/modules/key-management-service',
        ),
      },
    },
  }),
);
