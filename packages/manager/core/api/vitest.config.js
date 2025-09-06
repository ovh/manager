import { createConfig, defaultExcludedFiles, mergeConfig } from '@ovh-ux/manager-tests-setup';

export default mergeConfig(createConfig(), {
  test: {
    coverage: {
      exclude: [...defaultExcludedFiles],
    },
  },
});
