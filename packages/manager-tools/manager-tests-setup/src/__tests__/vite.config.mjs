import { sharedConfig, createConfig, mergeConfig, } from '../index.js';

export default mergeConfig(
  sharedConfig,
  createConfig({
    test: {
      setupFiles: './src/__tests__/setupTests.js',
    },
  }),
);
