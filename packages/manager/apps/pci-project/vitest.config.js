import path from 'path';
import {
  sharedConfig,
  mergeConfig,
  createConfig,
} from '@ovh-ux/manager-tests-setup';

export default mergeConfig(
  sharedConfig,
  createConfig({
    test: {
      setupFiles: './src/setupTests.tsx',
      fileParallelism: false,
      maxWorkers: 1,
      pollOptions: {
        forks: { singleFork: true },
        threads: { singleThread: true },
      },
      coverage: {
        include: ['src'],
        exclude: [
          'src/**/*.type.*',
          'src/**/*constants.ts',
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
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  }),
);
