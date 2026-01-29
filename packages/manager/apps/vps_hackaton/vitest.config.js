import { defineConfig, mergeConfig } from 'vitest/config';
import { sharedConfig } from '@ovh-ux/manager-tests-setup';
import path from 'path';

export default mergeConfig(
  sharedConfig,
  defineConfig({
    test: {
      setupFiles: ['./setupTests.ts'],
      coverage: {
        exclude: [
          '**/node_modules/**',
          '**/dist/**',
          '**/*.spec.{ts,tsx}',
          '**/setupTests.ts',
        ],
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@/public': path.resolve(__dirname, './public'),
      },
    },
  }),
);
