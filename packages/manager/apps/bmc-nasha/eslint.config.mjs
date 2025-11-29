import { eslintSharedConfig } from '@ovh-ux/manager-static-analysis-kit';

export default [
  ...eslintSharedConfig,
  {
    rules: {
      'check-file/no-index': 'off',
      'max-lines-per-function': ['error', { max: 100 }],
    },
  },
];
