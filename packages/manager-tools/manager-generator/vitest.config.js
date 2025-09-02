import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    exclude: ['node_modules', 'dist', 'coverage', 'bin', 'template'],
    coverage: {
      include: ['src/**/*.{js,ts,jsx,tsx}'],
      exclude: [
        '**/*.d.ts',
        '**/*.test.*',
        '**/*.spec.*',
        'vite-*.ts',
        '**/*schema.ts',
        '**/*presets.ts',
        '**/*types.ts',
        '**/*config.ts*',
      ],
    },
  },
});
