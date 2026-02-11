import path from 'path';

import {
  createConfig,
  mergeConfig,
  sharedConfig,
  defaultDedupedDependencies,
  stubStylesPlugin,
  INLINE_DEPS,
} from '@ovh-ux/manager-tests-setup';

export default mergeConfig(
  sharedConfig,
  createConfig({
    plugins: [...(sharedConfig.plugins ?? []), stubStylesPlugin()],
    test: {
      server: {
        deps: {
          inline: INLINE_DEPS,
        },
      },
      setupFiles: './src/setupTests.ts',
      coverage: {
        include: ['src'],
        exclude: [
          'src/interface',
          'src/__tests__',
          'src/vite-*.ts',
          'src/App.tsx',
          'src/core/ShellRoutingSync.tsx',
          'src/i18n.ts',
          'src/main.tsx',
          'src/routes.tsx',
        ],
      },
    },
    resolve: {
      dedupe: [...defaultDedupedDependencies],
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@translation': path.resolve(__dirname, 'public/translations'),
      },
      mainFields: ['module'],
    },
  }),
);
