import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import dts from 'vite-plugin-dts';
import path from 'path';
import tailwindcss from 'tailwindcss';
import { getBaseConfig } from '@ovh-ux/manager-vite-config';

const baseConfig = getBaseConfig({});

export default defineConfig({
  ...baseConfig,
  plugins: [
    react(),
    dts({
      outDir: '../dist/types',
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
  build: {
    outDir: '../dist',
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'ManagerReactComponentsLib',
      fileName: (format) => `manager-react-components-lib.${format}.ts`,
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        '@tanstack/react-query',
        'react-router-dom',
        'react-i18next',
        'i18next',
        'i18next-http-backend',
        '@ovh-ux/manager-react-shell-client',
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          '@tanstack/react-query': 'ReactQuery',
          'react-router-dom': 'ReactRouterDOM',
          'react-i18next': 'ReactI18next',
          i18next: 'i18next',
          'i18next-http-backend': 'i18nextHttpBackend',
          '@ovh-ux/manager-react-shell-client': 'ManagerReactShellClient',
        },
      },
    },
  },
});
