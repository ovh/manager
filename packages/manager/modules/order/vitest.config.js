import {
  createConfig,
  mergeConfig,
  sharedConfig,
  defaultExcludedFiles,
} from '@ovh-ux/manager-tests-setup';

export default mergeConfig(
  sharedConfig,
  createConfig({
    test: {
      coverage: {
        exclude: [...defaultExcludedFiles, 'src/__mocks__'],
      },
    },
  }),
);
