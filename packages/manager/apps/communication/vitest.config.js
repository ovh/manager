import path from 'path';
import {
  sharedConfig,
  mergeConfig,
  createConfig,
  stubStylesPlugin,
  defaultDedupedDependencies,
} from '@ovh-ux/manager-tests-setup';

export default mergeConfig(
  sharedConfig,
  createConfig({
    plugins: [...(sharedConfig.plugins ?? []), stubStylesPlugin()],
    test: {
      setupFiles: './src/setupTests.ts',
      deps: {
        inline: ['@ovhcloud/ods-react'],
      },
    },
    resolve: {
      dedupe: [...defaultDedupedDependencies],
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  }),
);
