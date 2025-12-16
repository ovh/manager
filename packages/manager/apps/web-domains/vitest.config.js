import path from 'path';
import {
  sharedConfig,
  mergeConfig,
  createConfig,
	defaultDedupedDependencies,
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
      css: false,
      server: {
        deps: {
          inline: ['@ovhcloud/ods-react', '@ovh-ux/manager-react-shell-client', '@ovh-ux/muk'],
        },
      },
    },
    resolve: { dedupe: [...defaultDedupedDependencies],
      alias: {
        '@/public': path.resolve(__dirname, 'public'),
        '@': path.resolve(__dirname, 'src'),
      },
      mainFields: ['module'],
    },
  }),
);
