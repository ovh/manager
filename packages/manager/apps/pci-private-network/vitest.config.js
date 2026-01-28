import path from 'path';
import react from '@vitejs/plugin-react';

import {
  createConfig,
  mergeConfig,
  sharedConfig,
  defaultDedupedDependencies,
} from '@ovh-ux/manager-tests-setup';

function relativeImgPathImport() {
  return {
    name: 'relative-img-path-import',
    transform(_code, id) {
      if (/(jpg|jpeg|png|webp|gif|svg)$/.test(id)) {
        const imgSrc = path.relative(process.cwd(), id);
        return {
          code: `export default '${imgSrc}'`,
        };
      }
      return undefined;
    },
  };
}

export default mergeConfig(
  sharedConfig,
  createConfig({
    plugins: [react(), relativeImgPathImport()],
    test: {
      setupFiles: './src/setupTests.ts',
      coverage: {
        include: ['src'],
        exclude: [
          'src/interface',
          'src/__tests__',
          'src/**/*constants.ts',
          'src/vite-*.ts',
          'src/App.tsx',
          'src/core/ShellRoutingSync.tsx',
          'src/core/HidePreloader.tsx',
          'src/i18n.ts',
          'src/main.tsx',
          'src/routes.tsx',
          'src/queryClient.ts',
        ],
      },
    },
    resolve: {
      dedupe: [...defaultDedupedDependencies],
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
      mainFields: ['module'],
    },
  }),
);
