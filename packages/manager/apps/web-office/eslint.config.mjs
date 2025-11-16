import { eslintSharedConfig } from '@ovh-ux/manager-static-analysis-kit';

export default [
  ...eslintSharedConfig,
  {
    rules: {
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/incompatible-library': 'off',
      'react-hooks/refs': 'off',
      'react-hooks/immutability': 'off',
      'react-hooks/preserve-manual-memoization': 'off',
    },
  },
];
