import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import dts from 'vite-plugin-dts';
import path from 'path';
import tailwindcss from 'tailwindcss';
import { getBaseConfig } from '@ovh-ux/manager-vite-config';
import * as packageJson from './package.json';

const baseConfig = getBaseConfig({});
const pathSrc = path.resolve(__dirname, 'src');
const externalDeps = [
  ...Object.keys(packageJson.peerDependencies || {}),
  '@ovhcloud/ods-components/react',
];

export default defineConfig({
  ...baseConfig,
  resolve: {
    alias: {
      '@/': pathSrc,
    },
  },
  plugins: [
    react(),
    dts({
      root: __dirname,
      insertTypesEntry: true,
      outDir: 'dist/types',
    }),
    /*
     * Visualizer emits an HTML file that allows to check what's really included in the bundle.
     * Uncomment if you want to run the plugin and check the output dist.
     * Be sure that plugin is installed before and well imported.
     */
    // visualizer({
    //   filename: 'stats/bundle-analysis.html',
    // }),
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
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
    lib: {
      entry: path.resolve(pathSrc, 'index.ts'),
      name: 'ManagerPciCommonLib',
      formats: ['esm', 'cjs'],
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: (id) =>
        externalDeps.some((dep) => id === dep || id.startsWith(`${dep}/`)),
    },
    sourcemap: 'hidden',
  },
});
