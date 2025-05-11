import { sharedConfig, createConfig, mergeConfig, } from '../index.js';

export default mergeConfig(
  sharedConfig,
  createConfig({
    test: {
      setupFiles: './src/test-shared-config/setupTests.js',
    },
  }),
);
