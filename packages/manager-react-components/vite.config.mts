import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import dts from 'vite-plugin-dts';
import path from 'path';
import tailwindcss from 'tailwindcss';
import { getBaseConfig } from '@ovh-ux/manager-vite-config';
import { viteStaticCopy } from 'vite-plugin-static-copy';

const baseConfig = getBaseConfig({});

export default defineConfig({
  ...baseConfig,
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.svg'],
  plugins: [
    react(),
    dts({
      outDir: '../dist/types',
      insertTypesEntry: true,
    }),
    viteStaticCopy({
      targets: [
        {
          src: '../public/assets/*.png',
          dest: 'public/assets',
        },
      ],
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
      entry: path.resolve(__dirname, 'src/lib.ts'),
      name: 'ManagerReactComponentsLib',
      fileName: (format) => `manager-react-components-lib.${format}.ts`,
    },
    rollupOptions: {
      external: [
        '@ovh-ux/request-tagger',
        '@ovh-ux/manager-core-api',
        '@ovh-ux/manager-react-shell-client',
        '@tanstack/react-query',
        'i18next',
        'i18next-http-backend',
        'react',
        'react-dom',
        'react-router-dom',
        'react-i18next',
        'zustand',
        '@ovhcloud/ods-common-core',
        '@ovhcloud/ods-common-theming',
        '@ovhcloud/ods-components',
        '@ovhcloud/ods-components/react',
        '@ovhcloud/ods-theme-blue-jeans',
      ],
      output: {
        globals: {
          '@ovh-ux/manager-core-api': 'ManagerCoreApi',
          '@ovh-ux/manager-react-shell-client': 'ManagerReactShellClient',
          '@tanstack/react-query': 'ReactQuery',
          i18next: 'i18next',
          'i18next-http-backend': 'i18nextHttpBackend',
          react: 'React',
          'react-i18next': 'ReactI18next',
          'react-dom': 'ReactDOM',
          'react-router-dom': 'ReactRouterDOM',
          zustand: 'Zustand',
        },
      },
    },
  },
});
