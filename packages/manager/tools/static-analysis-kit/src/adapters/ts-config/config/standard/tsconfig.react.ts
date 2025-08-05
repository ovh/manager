import { tsBaseConfig } from '../../rules/tsconfig.base';

export default {
  ...tsBaseConfig,
  compilerOptions: {
    ...tsBaseConfig.compilerOptions,
    module: 'ESNext',
    moduleResolution: 'bundler',
    lib: ['DOM', 'DOM.Iterable', 'ES2021'],
    jsx: 'react-jsx',
    isolatedModules: true,
    noEmit: true,
    types: ['vite/client', 'vitest/globals', '@testing-library/jest-dom'],
  },
};
