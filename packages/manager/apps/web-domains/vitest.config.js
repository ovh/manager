import path from 'path';
import {
  sharedConfig,
  mergeConfig,
  createConfig, 	defaultDedupedDependencies,
  defaultExcludedFiles,
} from '@ovh-ux/manager-tests-setup';

export default mergeConfig(
  sharedConfig,
  createConfig({
    test: {
      coverage: {
        exclude: [...defaultExcludedFiles, 'src/pages/layout.tsx'],
      },
      setupFiles: 'src/common/setupTests.tsx',
      server: {
        deps: {
          inline: ['@ovhcloud/ods-react'],
        },
      },
    },
    resolve: { dedupe: [...defaultDedupedDependencies], 
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
      mainFields: ['module'],
    },
  }),
);
