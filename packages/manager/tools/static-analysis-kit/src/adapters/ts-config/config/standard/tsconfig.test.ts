import { tsBaseConfig } from '../../rules/tsconfig.base';

export default {
  ...tsBaseConfig,
  compilerOptions: {
    ...tsBaseConfig.compilerOptions,
    module: 'ESNext',
    moduleResolution: 'NodeNext',
    types: ['vitest/globals', 'vite/client', 'node', '@testing-library/jest-dom'],
    jsx: 'react-jsx',
  },
  include: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx', 'vitest.setup.ts'],
};
