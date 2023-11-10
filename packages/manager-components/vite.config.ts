import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import dts from 'vite-plugin-dts';
import tailwindcss from 'tailwindcss';
import { UserConfigExport } from 'vite';

const app = async (): Promise<UserConfigExport> => {
  return defineConfig({
    plugins: [
      react(),
      dts({
        insertTypesEntry: true,
      }),
    ],
    css: {
      postcss: {
        plugins: [tailwindcss],
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
    },
  });
};

export default app;
