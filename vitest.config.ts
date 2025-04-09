import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true, // Enable global test functions (like `describe`, `it`)
    environment: 'jsdom', // Set the environment to jsdom for frontend tests
    include: [
      'packages/components/ovh-shell/**/*.{test,spec}.{ts,tsx,js,jsx}',
      'packages/manager/apps/container/**/*.{test,spec}.{ts,tsx,js,jsx}',
      'packages/core/url-builder/**/*.{test,spec}.{ts,tsx,js,jsx}',
    ], // Glob patterns for test files
    exclude: ['node_modules/**', 'dist/**'], // Exclude directories from testing

    // Coverage configuration
    coverage: {
      reporter: ['text', 'lcov', 'json'], // Enable LCOV and other formats
      provider: 'v8', // V8 is the default provider for coverage
      exclude: [
        '**/*.d.ts', // Exclude type declaration files
      ],
      reportsDirectory: './coverage', // Directory where the coverage reports will be stored
      reportOnFailure: true,
    },

    // Module resolution
    alias: {
      '^~/(.*)$': './src/$1',
      '^@ovh-ux/manager-core-api': './packages/manager/core/api/src/index.ts',
      '^@ovh-ux/manager-react-shell-client':
        './packages/manager/core/shell-client/src/index.tsx',
      '/axios/': 'axios/dist/node/axios.cjs',
      uuid: require.resolve('uuid'),
      nanoid: require.resolve('nanoid'),
    },

    // Transform settings
    transform: {
      // Vitest handles TS and JSX natively, so we don’t need a specific transformer
      '^.+\\.(js|jsx|ts|tsx)$': 'esbuild', // Use esbuild for JavaScript and TypeScript
      '^.+\\.css$': './jest/mocks/cssMock.js', // Mock CSS files if needed
    },

    // Reset mocks between tests
    resetMocks: true,

    // Other configurations
    moduleDirectories: ['node_modules'],
    testPathIgnorePatterns: [
      '/node_modules/',
      'packages/manager/apps/container',
      'packages/manager/apps/dedicated',
    ],

    // Coverage exclusions
    coveragePathIgnorePatterns: [
      '.*\\.(interface|module|schema|entity|dto|enum|d).ts',
      '.*\\.e2e-spec.ts',
      'index.ts',
      'main.ts',
    ],
  },
});
