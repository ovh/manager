import path from 'path';
import {
  sharedConfig,
  mergeConfig,
  createConfig,
  stubStylesPlugin,
} from '@ovh-ux/manager-tests-setup';

export default mergeConfig(
  sharedConfig,
  createConfig({
    plugins: [...(sharedConfig.plugins ?? []), stubStylesPlugin()],
    test: {
      setupFiles: './src/setupTests.ts',
      fileParallelism: false,
      maxWorkers: 1,
      pollOptions: {
        forks: { singleFork: true },
        threads: { singleThread: true },
      },
      deps: {
        inline: ['@ovhcloud/ods-react'],
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  }),
);
