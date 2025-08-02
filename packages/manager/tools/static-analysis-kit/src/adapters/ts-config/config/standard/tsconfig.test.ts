import { tsBaseConfig } from '../../rules/tsconfig.base';

export default {
  ...tsBaseConfig,
  compilerOptions: {
    ...tsBaseConfig.compilerOptions,
    module: 'ESNext',
    moduleResolution: 'NodeNext',
    jsx: 'react-jsx',
    types: ['node', 'vite/client', 'vitest/globals', '@testing-library/jest-dom'],
  },
  include: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx', 'vitest.setup.ts'],
};
