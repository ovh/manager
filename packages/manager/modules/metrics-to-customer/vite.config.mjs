import { defineConfig } from 'vitest/config';
import dts from 'vite-plugin-dts';
import path from 'path';
import tailwindcss from 'tailwindcss';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { getBaseConfig } from '@ovh-ux/manager-vite-config';
import * as packageJson from './package.json' with { type: 'json' };

const baseConfig = getBaseConfig({});
const pathSrc = path.resolve(__dirname, 'src');
const pathPublic = path.resolve(__dirname, 'public');
const externalDeps = [
  ...Object.keys(packageJson.default.peerDependencies || {}),
  '@ovhcloud/ods-components/react',
  '@ovh-ux/muk',
  'recharts',
];

export default defineConfig({
  ...baseConfig,
  resolve: {
    alias: {
      '@/public': pathPublic,
      '@': pathSrc,
    },
  },
  plugins: [
    ...baseConfig.plugins,
    dts({
      root: __dirname,
      insertTypesEntry: true,
      outDir: 'dist/types',
    }),
    viteStaticCopy({
      targets: [
        {
          src: `${pathSrc}/**/*.scss`,
          dest: 'src',
          rename: (name, ext, fullPath) => {
            const relativePath = path.relative(pathSrc, fullPath);
            return relativePath;
          },
        },
        {
          src: `${pathPublic}/translations`,
          dest: 'metrics-to-customer',
        },
      ],
    }),
  ],
  css: {
    ...baseConfig.css,
    postcss: {
      plugins: [tailwindcss],
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-utils/setup-test.ts'],
  },
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
    cssCodeSplit: false,
    lib: {
      entry: path.resolve(pathSrc, 'lib.ts'),
      name: 'MetricsToCustomerLib',
      formats: ['esm'],
      fileName: () => 'src/lib.js',
    },
    rollupOptions: {
      external: (id) =>
        externalDeps.some((dep) => id === dep || id.startsWith(`${dep}/`)),
      output: {
        assetFileNames: (assetInfo) => {          
          if (assetInfo.name?.endsWith('.css')) {
            return 'style.css';
          }

          if (assetInfo.name?.endsWith('.scss')) {
            return '[name][extname]';
          }
          return '[name][extname]';
        },
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: 'src/[name].js',
      },
    },
    sourcemap: 'hidden',
  },
});
