import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';
import reactRefresh from '@vitejs/plugin-react-refresh';
import legacy from '@vitejs/plugin-legacy';

import viteOvhDevServerPlugin from './plugin/dev-server.js';

const isContainerApp = process.cwd().endsWith('container');

export default {
  base: isContainerApp ? './' : '/app/',
  root: resolve(process.cwd(), 'src'),
  clearScreen: false,
  publicDir: 'public',
  resolve: {
    alias: {
      '@': resolve(join(process.cwd(), 'src')),
    },
  },
  plugins: [
    reactRefresh(),
    legacy({
      targets: ['defaults'],
    }),
    viteOvhDevServerPlugin(isContainerApp),
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
    port: process.env.CONTAINER ? 9001 : 9000,
    strictPort: true,
  },
};
