import { defineConfig } from 'vitest/config';
import sonarReporter from 'vitest-sonar-reporter';

export default defineConfig({
  test: {
    // Define where test files are located
    include: [
      'src/**/*.{test,spec}.{ts,tsx}',
      'tests/**/*.test.{ts,tsx}',
      'src/**/*.{test,spec}.ts',
      'src/**/*.{test,spec}.tsx',
      'src/**/*.ts',
      'src/**/*.js',
    ], // Adjust this based on your test files

    // Coverage configuration
    coverage: {
      reporter: ['text', 'lcov', 'json'], // Enable LCOV and other coverage formats
      provider: 'v8', // V8 is the default provider for coverage
      exclude: ['**/node_modules/**', '**/*.spec.js'], // Exclude unwanted directories
      reportsDirectory: './coverage', // Directory for storing coverage reports
    },

    // Other test-related configurations
    environment: 'node', // Node environment for backend testing
  },
});
