import { sharedConfig, createConfig, mergeConfig, testEnvConfig } from '../index.js';

export default mergeConfig(
  sharedConfig,
  createConfig({
    test: {
      setupFiles: './src/test-shared-config/setupTests.js',
      ...testEnvConfig,
    },
  }),
);
