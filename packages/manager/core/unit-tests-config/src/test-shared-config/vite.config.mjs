import { mergeConfig } from 'vite';
import { defineConfig } from 'vitest/config';
import sharedConfig from '../index';

export default mergeConfig(
  sharedConfig,
  defineConfig({
    test: {
      setupFiles: './src/test-shared-config/setupTests.js'
    },
  }),
);
