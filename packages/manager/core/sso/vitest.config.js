import {
  createConfig,
  mergeConfig,
  defaultExcludedFiles,
} from '@ovh-ux/manager-tests-setup';

export default mergeConfig(createConfig(), {
  test: {
    coverage: {
      exclude: [...defaultExcludedFiles],
    },
  },
});
