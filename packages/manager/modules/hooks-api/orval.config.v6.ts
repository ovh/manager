import config from './orval.config';

export default {
  ...config,
  dummy: {
    ...config.dummy,
    output: {
      ...config.dummy.output,
      override: {
        ...config.dummy.output.override,
        mutator: {
          path: './custom-instance.ts',
          name: 'customInstanceV6',
        },
      },
    },
  },
};
