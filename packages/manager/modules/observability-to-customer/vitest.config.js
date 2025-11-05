import path from 'path';
import {
  createConfig,
  defaultExcludedFiles,
  mergeConfig,
  sharedConfig,
} from '@ovh-ux/manager-tests-setup';

export default mergeConfig(
  sharedConfig,
  createConfig({
    test: {
      setupFiles: ['./setupTests.ts'],
      coverage: {
        exclude: [
          ...defaultExcludedFiles,
          // App-specific exclusions (not in shared config):
          'vite-*.ts',          
          '__mocks__',          
          '**/Test.utils.tsx',
        ],
      },
    },
    resolve: {
      alias: {
        '@/public': path.resolve(__dirname, 'public'),
        '@': path.resolve(__dirname, 'src'),
      },
      mainFields: ['module'],
    },
  }),
);
