import { createConfig, mergeConfig, sharedConfig } from '../index.js';

export default mergeConfig(
  sharedConfig,
  createConfig({
    test: {
      setupFiles: './src/__tests__/setupTests.js',
    },
  }),
);
