import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import {
  sharedConfig,
  mergeConfig,
} from '@ovh-ux/manager-unit-tests-config'; // Update path if local

export default mergeConfig(
  sharedConfig,
  defineConfig({
    plugins: [react()], // Optional: only needed if you're adding more plugins
    test: {
      setupFiles: './src/setupTests.ts', // ✅ App-specific
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'), // ✅ App-specific
      },
    },
  })
);
