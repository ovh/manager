import { tsBaseConfig } from './tsconfig.base';

export const tsStrictBaseConfig = {
  ...tsBaseConfig,
  compilerOptions: {
    ...tsBaseConfig.compilerOptions,
    strict: true,
    noImplicitOverride: true,
    noUncheckedIndexedAccess: true,
    noFallthroughCasesInSwitch: true,
    noUnusedParameters: true,
  },
};
