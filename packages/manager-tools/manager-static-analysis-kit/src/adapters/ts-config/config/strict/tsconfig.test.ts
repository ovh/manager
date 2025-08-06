import { tsStrictBaseConfig } from '../../rules/tsconfig.base.strict';

export default {
  ...tsStrictBaseConfig,
  compilerOptions: {
    ...tsStrictBaseConfig.compilerOptions,
    module: 'ESNext',
    moduleResolution: 'NodeNext',
    jsx: 'react-jsx',
    types: ['node', 'vite/client', 'vitest/globals', '@testing-library/jest-dom'],
  },
  include: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx', 'vitest.setup.ts'],
};
