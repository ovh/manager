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
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-utils/setup-test.ts'],
    // CSS config for ODS v19 compatibility
    css: true,
    server: {
      deps: {
        inline: ['@ovhcloud/ods-react', '@ovh-ux/manager-react-shell-client'],
      },
    },
    coverage: {
      exclude: [
        // App-specific exclusions:
        'src/types',
        'src/translations',
        'src/test-utils',
        'src/index.ts',
        'src/data/types',
        'src/data/mocks',
        'src/**/*.spec.ts',
        'src/**/*.spec.tsx',
      ],
    },
  },
  resolve: {
    alias: {
      '@/public': path.resolve(__dirname, 'public'),
      '@': path.resolve(__dirname, 'src'),
    },
    // Deduplicate React and React-DOM to prevent "Invalid hook call" errors
    dedupe: [...defaultDedupedDependencies, '@tanstack/react-virtual'],
    // Ensure .js extensions are added for ESM resolution
    extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json'],
  },
}));

