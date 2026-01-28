import path from 'path';
import {
  sharedConfig,
  mergeConfig,
  createConfig,
  defaultDedupedDependencies,
} from '@ovh-ux/manager-tests-setup';

export default mergeConfig(
  sharedConfig,
  createConfig({
    test: {
      setupFiles: './src/setupTests.tsx',
      coverage: {
        include: ['src'],
        exclude: [
          'src/**/*.type.*',
          'src/**/*constants.ts',
          'src/**/*constant.ts',
          'pci-project.config.ts',
          'src/vite-*.ts',
          'src/App.tsx',
          'src/i18n.ts',
          'src/index.tsx',
          'src/pages/Layout.tsx',
          'src/routes',
          'src/queryClient.ts',
          'src/wrapperRenders.tsx',
        ],
      },
    },
    resolve: {
      dedupe: [...defaultDedupedDependencies],
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  }),
);
