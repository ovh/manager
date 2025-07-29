import { tsStrictBaseConfig } from '../../rules/tsconfig.base.strict';

export default {
  ...tsStrictBaseConfig,
  compilerOptions: {
    ...tsStrictBaseConfig.compilerOptions,
    module: 'ESNext',
    moduleResolution: 'bundler',
    lib: ['DOM', 'DOM.Iterable', 'ES2020'],
    jsx: 'react-jsx',
    isolatedModules: true,
    noEmit: true,
    types: ['vite/client'],
  },
};
