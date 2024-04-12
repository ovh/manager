import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import dts from 'vite-plugin-dts';
import tailwindcss from 'tailwindcss';
import { UserConfigExport } from 'vite';

const app = async (): Promise<UserConfigExport> => {
  return defineConfig({
    resolve: {
      dedupe: [
        '@ovh-ux/manager-react-shell-client',
        '@ovh-ux/manager-core-api',
        'i18next',
        'react',
        'react-dom',
        'react-i18next',
        'react-router-dom',
        'zustand',
      ],
    },
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
