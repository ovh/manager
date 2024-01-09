const rootConfig = require('../../../../jest.config.js');

rootConfig.roots = [
  '<rootDir>/packages/components',
  '<rootDir>/packages/manager',
  '<rootDir>/__mocks__',
];

rootConfig.moduleNameMapper = {
  ...rootConfig.moduleNameMapper,
  '^@/(.*)$': '<rootDir>/packages/manager/apps/vrack-services/src/$1',
};

rootConfig.testMatch = [
  '<rootDir>/packages/**/tests/**/*.{spec,test,step}.{js,jsx,ts,tsx}',
];

rootConfig.transformIgnorePatterns = [
  '[/\\\\]node_modules/(?!lodash-es|@ovhcloud|@stencil|axios|@bundled-es-modules)',
];
rootConfig.projects = [
  '<rootDir>/packages/manager/apps/vrack-services/jest.config.js',
];

module.exports = rootConfig;
