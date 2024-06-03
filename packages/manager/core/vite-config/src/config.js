import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';
import svgr from 'vite-plugin-svgr';

import IframeHmrPlugin from './plugin/iframe-hmr.js';
import viteOvhDevServerPlugin from './plugin/dev-server.js';

const isContainerApp = process.cwd().endsWith('container');
const runInContainer = process.env.CONTAINER;

const getBaseConfig = (config) => {
  const envConfig = config || {};

  if (envConfig.isLABEU || process.env.LABEU) {
    const labeuHost = process.env.LABEU_HOST;
    if (!labeuHost) {
      throw new Error(
        'Please define the environment variable "LABEU_HOST=host" to use LABEU env',
      );
    }
    envConfig.host = labeuHost;
  }

  return {
    base: isContainerApp || !runInContainer ? './' : '/app/',
    root: resolve(process.cwd(), 'src'),
    clearScreen: false,
    publicDir: 'public',
    resolve: {
      alias: {
        '@': resolve(join(process.cwd(), 'src')),
      },
      dedupe: [
        '@ovh-ux/manager-react-shell-client',
        'i18next',
        'react',
        'react-dom',
        'react-i18next',
        'react-router-dom',
        'zustand',
      ],
    },
    define: {
      __VERSION__: process.env.VERSION ? `'${process.env.VERSION}'` : 'null',
    },
    plugins: [
      react(),
      legacy({
        targets: ['defaults'],
      }),
      viteOvhDevServerPlugin({ isContainerApp, envConfig }),
      IframeHmrPlugin(),
      svgr(),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          includePaths: [
            resolve(
              dirname(fileURLToPath(import.meta.url)),
              '../../../../../node_modules',
            ),
          ],
        },
      },
    },
    build: {
      outDir: resolve(process.cwd(), 'dist'),
      emptyOutDir: true,
      minify: true,
      sourcemap: true,
    },
    server: {
      port: runInContainer ? 9001 : 9000,
      strictPort: true,
      hmr: {
        host: 'localhost',
        port: runInContainer ? 9001 : 9000,
      },
    },
  };
};

export default getBaseConfig;
