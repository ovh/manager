module.exports = {
  roots: ['<rootDir>/packages/components', '<rootDir>/packages/manager'],
  projects: ['<rootDir>/packages/manager/apps/container/jest.config.js'],
  setupFilesAfterEnv: ['<rootDir>/jest/mocks/jest.setup.js'],
  collectCoverageFrom: ['packages/**/*.{js,jsx,ts,tsx}', '!packages/**/*.d.ts'],
  testMatch: [
    '<rootDir>/packages/**/__tests__/**/*.{spec,test}.{js,jsx,ts,tsx}',
    '<rootDir>/packages/**/*.{spec,test}.{js,jsx,ts,tsx}',
  ],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx|mjs|cjs|ts|tsx)$': '<rootDir>/node_modules/babel-jest',
    '^.+\\.scss$': 'jest-scss-transform',
    '^.+\\.css$': '<rootDir>/jest/mocks/cssMock.js',
  },
  transformIgnorePatterns: [
    '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|cjs|ts|tsx)$',
    '^.+\\.module\\.(css|sass|scss)$',
    '<rootDir>/node_modules/(?!lodash-es)',
  ],
  moduleNameMapper: {
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    '^lodash-es$': 'lodash',
    '^@ovh-ux/shell$': '<rootDir>/packages/components/ovh-shell/src',
    '^@ovh-ux/ovh-reket$': '<rootDir>/packages/components/ovh-reket/src',
    '^@ovh-ux/manager-config$': '<rootDir>/packages/manager/modules/config/src',
  },
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
  resetMocks: true,
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
};
