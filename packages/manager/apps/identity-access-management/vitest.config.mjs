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
    },
    resolve: { dedupe: [...defaultDedupedDependencies],
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  }),
);
