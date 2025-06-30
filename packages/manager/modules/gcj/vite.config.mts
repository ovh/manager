import { defineConfig } from 'vitest/config';
import dts from 'vite-plugin-dts';
import path from 'path';
import { getBaseConfig } from '@ovh-ux/manager-vite-config';
import { viteStaticCopy } from 'vite-plugin-static-copy';

const baseConfig = getBaseConfig({});

export default defineConfig({
  ...baseConfig,
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.svg'],
  plugins: [
    ...baseConfig.plugins,
    dts({
      outDir: '../dist/types',
      insertTypesEntry: true,
    }),
    viteStaticCopy({
      targets: [
        {
          src: './lib.scss',
          dest: '',
        },
      ],
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
  },
  build: {
    outDir: '../dist',
    lib: {
      entry: path.resolve(__dirname, 'src/lib.ts'),
      name: 'ManagerGcjLib',
      fileName: (format) => `manager-gcj-lib.${format}.ts`,
    },
    rollupOptions: {
      external: [
        '@ovh-ux/request-tagger',
        '@ovh-ux/manager-react-components',
        'i18next',
        'i18next-http-backend',
        'react',
        'react-cookie',
        'react-i18next',
        '@ovhcloud/ods-components',
        '@ovhcloud/ods-components/react',
        '@ovhcloud/ods-themes',
      ],
      output: {
        globals: {
          '@ovh-ux/manager-react-components': 'ManagerReactComponents',
          i18next: 'i18next',
          'i18next-http-backend': 'i18nextHttpBackend',
          react: 'React',
          'react-i18next': 'ReactI18next',
          'react-cookie': 'ReactCookie',
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'style.css';
          }
          return '[name][extname]';
        },
      },
    },
  },
});
