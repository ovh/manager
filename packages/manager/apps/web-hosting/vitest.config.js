import path from 'path';

import {
  createConfig,
  defaultExcludedFiles,
  defaultDedupedDependencies,
  mergeConfig,
  sharedConfig,
} from '@ovh-ux/manager-tests-setup';

export default mergeConfig(
  sharedConfig,
  createConfig({
    plugins: [
      ...sharedConfig.plugins,
      {
        name: 'ignore-css-plugin',
        transform(_, id) {
          if (id.endsWith('.css')) return { code: '', map: null };
        },
      },
    ],
    test: {
      setupFiles: ['src/utils/test.setup.tsx'],
      css: true,
      coverage: {
        exclude: [
          ...defaultExcludedFiles,
          // App-specific exclusions (not in shared config):
          'src/**/**.constant.*',
          'src/routes/*',
          'src/api',
          'src/types/*',
          'src/web-hosting.config.ts',
          'src/hooks/index.ts',
          'src/hooks/types.ts',
          'src/pages/404.tsx',
          'src/pages/layout.tsx',
          'src/queryClient.ts',
          'src/utils/index.ts',
        ],
      },
    },
    mergeConfig,
    sharedConfig,
    resolve: {
      dedupe: [...defaultDedupedDependencies, '@ovhcloud/ods-react', '@ovhcloud/ods-themes'],
      alias: {
        '@/public': path.resolve(__dirname, 'public'),
        '@': path.resolve(__dirname, 'src'),
      },
      mainFields: ['browser', 'module', 'main'],
    },
  }),
);
