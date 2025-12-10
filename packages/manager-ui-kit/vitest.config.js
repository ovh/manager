import path from 'path';

import { createConfig, defaultExcludedFiles, mergeConfig } from '@ovh-ux/manager-tests-setup';

export default mergeConfig(createConfig(), {
  test: {
    setupFiles: 'setupTests.ts',
    globals: true,
    environment: 'jsdom',
    coverage: {
      include: ['src'],
      exclude: [...defaultExcludedFiles],
    },
    server: {
      deps: {
        inline: [/@ovhcloud\/ods-react.*/],
      },
    },
    testTimeout: 60000,
    fileParallelism: false,
    maxWorkers: 1,
    pollOptions: {
      forks: {
        singleFork: true,
      },
      threads: {
        singleThread: true,
      },
    },
    // Ignore unhandled errors from ODS Modal async cleanup
    dangerouslyIgnoreUnhandledErrors: true,
    // Make vitest snapshot stable without dynamic hash
    snapshotSerializers: ['./settings/serialize-snapshots.ts'],
  },
  resolve: {
    alias: {
      '@/setupTest': path.resolve(__dirname, 'setupTests.ts'),
      '@': path.resolve(__dirname, 'src'),
      '@tanstack/react-virtual': path.resolve(
        __dirname,
        'src/__mocks__/@tanstack/react-virtual.ts',
      ),
    },
    mainFields: ['module'],
  },
});
