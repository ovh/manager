import path from 'path';

import {
  createConfig,
  defaultDedupedDependencies,
  defaultExcludedFiles,
  mergeConfig,
  sharedConfig,
  sharedCssConfig,
} from '@ovh-ux/manager-tests-setup';

import fixExtensionlessImportsPlugin from './vite-plugin-fix-extensionless-imports.js';

const config = mergeConfig(
  sharedConfig,
  createConfig({
    plugins: [fixExtensionlessImportsPlugin()],
    test: {
      setupFiles: ['./setupTests.ts'],
      ...sharedCssConfig,
      coverage: {
        exclude: [
          ...defaultExcludedFiles,
          // App-specific exclusions (not in shared config):
          'vite-*.ts',
          'App.tsx',
          '__mocks__',
          '**/Routes.tsx',
          '**/QueryClient.ts',
          '**/*.type.ts',
          '**/404.page.tsx',
          '**/Mock.utils.tsx',
        ],
      },
    },
    resolve: {
      dedupe: [...defaultDedupedDependencies],
      alias: {
        // eslint-disable-next-line no-undef
        '@': path.resolve(__dirname, 'src'),
      },
    },
  }),
);

console.log('sharedCssConfig : ', sharedCssConfig);
console.log(config);
export default config;
