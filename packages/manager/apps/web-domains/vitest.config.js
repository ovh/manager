import path from 'path';
import {
  sharedConfig,
  mergeConfig,
  createConfig,
  defaultExcludedFiles,
} from '@ovh-ux/manager-tests-setup';

export default mergeConfig(
  sharedConfig,
  createConfig({
    test: {
      setupFiles: [],
      coverage: {
        exclude: [...defaultExcludedFiles, 'src/pages/layout.tsx'],
      },
      setupFiles: 'src/alldoms/setupTests.tsx',
      server: {
        deps: {
          inline: ['@ovhcloud/ods-react'],
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  }),
);
