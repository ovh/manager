import path from 'path';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import {
  sharedConfig,
  mergeConfig,
  createConfig,
  defaultExcludedFiles,
} from '@ovh-ux/manager-tests-setup';

export default mergeConfig(
  sharedConfig,
  createConfig({
    plugins: [
      react(),
      svgr({
        include: '**/*.svg',
      }),
    ],
    test: {
      coverage: {
        exclude: [...defaultExcludedFiles],
      },
    },
    resolve: {
      alias: {
        '@/public': path.resolve(__dirname, 'public'),
        '@': path.resolve(__dirname, 'src'),
      },
    },
  }),
);
