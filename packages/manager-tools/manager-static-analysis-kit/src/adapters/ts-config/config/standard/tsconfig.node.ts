import { tsBaseConfig } from '../../rules/tsconfig.base';

export default {
  ...tsBaseConfig,
  compilerOptions: {
    ...tsBaseConfig.compilerOptions,
    target: 'ES2022',
    module: 'NodeNext',
    moduleResolution: 'NodeNext',
    lib: ['ES2022'],
    types: ['node'],
  },
};
