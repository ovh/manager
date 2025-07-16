import { tsStrictBaseConfig } from '../../rules/tsconfig.base.strict';

export default {
  ...tsStrictBaseConfig,
  compilerOptions: {
    ...tsStrictBaseConfig.compilerOptions,
    target: 'ES2022',
    module: 'NodeNext',
    moduleResolution: 'NodeNext',
    lib: ['ES2022'],
    types: ['node'],
  },
};
