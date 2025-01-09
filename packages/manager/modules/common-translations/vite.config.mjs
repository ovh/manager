
import { defineConfig } from 'vite';
import path from 'path';
import dts from 'vite-plugin-dts';
import { viteStaticCopy } from 'vite-plugin-static-copy';

const pathSrc = path.resolve(__dirname, 'src');

export default defineConfig({
  root: path.resolve(process.cwd(), 'src'),
  resolve: {
    alias: {
      '@/': pathSrc,
    },
  },
  plugins:[
    dts({
      root: __dirname,
      outDir: 'dist/types',
      insertTypesEntry: true,
    }),
    viteStaticCopy({
      targets: [
        {
          src: `../public/translations/**/`,
          dest: '@ovh-ux/manager-common-translations',
        },
      ],
    }),
  ],
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
    lib: {
      entry: path.resolve(pathSrc, 'index.ts'),
      name: 'ManagerCommonTranslations',
      formats: ['esm', 'cjs'],
      fileName: (format) => `index.${format}.js`,
    }
  },
});
