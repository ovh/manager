import path from 'path';
import {
  sharedConfig,
  mergeConfig,
  createConfig,
  defaultDedupedDependencies,
  defaultExcludedFiles,
} from '@ovh-ux/manager-tests-setup';

export default mergeConfig(
  sharedConfig,
  createConfig({
    test: {
      setupFiles: [],
      coverage: {
        exclude: [
          ...defaultExcludedFiles,
          // App-specific exclusions (not in shared config):
          'src/pages/layout.tsx',
        ],
      },
      server: {
        deps: {
          inline: ['@ovhcloud/ods-react'],
        },
      },
      environment: "jsdom",
    },
    resolve: {
      dedupe: [...defaultDedupedDependencies],
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  }),
);
