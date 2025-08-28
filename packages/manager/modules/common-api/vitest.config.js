import { createConfig, mergeConfig, sharedConfig } from '@ovh-ux/manager-tests-setup';

// https://vitejs.dev/config/
export default mergeConfig(
  sharedConfig,
  createConfig({
    test: {
      coverage: {
        exclude: [],
      },
    },
    resolve: {
      mainFields: ['module'],
    },
  }),
);
