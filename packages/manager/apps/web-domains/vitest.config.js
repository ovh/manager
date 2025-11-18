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
        exclude: [
          ...defaultExcludedFiles,
          'src/pages/layout.tsx',
          'src/**/routes.tsx',
          'src/**/__tests__',
          'src/**/__mocks__',
          'src/**/data/**/*',
          'src/**/hooks/**/*',
          'src/**/types/**/*',
        ],
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
