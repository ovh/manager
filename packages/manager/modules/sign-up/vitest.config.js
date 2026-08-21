import {
  createConfig,
  mergeConfig,
  sharedConfig,
} from '@ovh-ux/manager-tests-setup';

export default mergeConfig(
  sharedConfig,
  createConfig({
    test: {
      coverage: {
        include: ['src/components/siret/**/*.js'],
      },
    },
  }),
);
