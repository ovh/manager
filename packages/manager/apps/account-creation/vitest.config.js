import path from 'path';
import {
  sharedConfig,
  mergeConfig,
  createConfig,
  defaultDedupedDependencies,
  defaultExcludedFiles,
  stubStylesPlugin,
} from '@ovh-ux/manager-tests-setup';

export default mergeConfig(
  sharedConfig,
  createConfig({
    plugins: [stubStylesPlugin()],
    test: {
      setupFiles: './src/setupTests.ts',
      coverage: {
        exclude: [...defaultExcludedFiles],
      },
      server: {
        deps: {
          inline: ['@ovhcloud/ods-react'],
        },
      },
    },
    resolve: {
      dedupe: [...defaultDedupedDependencies],
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@ovh-ux/manager-gcj-module': path.resolve(
          __dirname,
          '__mocks__/gcj-module.tsx',
        ),
      },
    },
  }),
);
