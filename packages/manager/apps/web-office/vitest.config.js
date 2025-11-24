import path from 'path';

import {
  createConfig,
  defaultDedupedDependencies,
  defaultExcludedFiles,
  mergeConfig,
  sharedConfig,
  sharedCssConfig,
} from '@ovh-ux/manager-tests-setup';

export default mergeConfig(
  sharedConfig,
  createConfig({
    test: {
      environment: 'jsdom',
      setupFiles: ['src/utils/test.setup.tsx'],
      ...sharedCssConfig,
      coverage: {
        exclude: [
          ...defaultExcludedFiles,
          // App-specific exclusions (not in shared config):
          'src/configInterface.ts',
          'src/api',
          'src/web-office.config.ts',
          'src/hooks/index.ts',
          'src/hooks/types.ts',
          'src/routes/routes.tsx',
          'src/utils/index.ts',
        ],
      },
    },
    resolve: {
      dedupe: [...defaultDedupedDependencies],
      alias: {
        '@/public': path.resolve(__dirname, 'public'),
        '@': path.resolve(__dirname, 'src'),
      },
    },
  }),
);
