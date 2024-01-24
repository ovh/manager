module.exports = {
  preset: 'ts-jest',
  setupFilesAfterEnv: ['<rootDir>/jest/mocks/jest.setup.js'],
  collectCoverageFrom: ['packages/**/*.{js,jsx,ts,tsx}', '!packages/**/*.d.ts'],
  testMatch: [
    '<rootDir>/packages/**/__tests__/**/*.{spec,test}.{js,jsx,ts,tsx}',
    '<rootDir>/packages/**/*.{spec,test}.{js,jsx,ts,tsx}',
  ],
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.(js|jsx|mjs|cjs|ts|tsx)$': '<rootDir>/node_modules/babel-jest',
    '^.+\\.scss$': 'jest-scss-transform',
    '^.+\\.css$': '<rootDir>/jest/mocks/cssMock.js',
  },
  transformIgnorePatterns: [
    'node_modules/(?!lodash-es|@ovhcloud|@stencil|@ovh-ux|uuid|jest-cucumber)',
    '^.+\\.module\\.(css|sass|scss)$',
    '<rootDir>/node_modules/(?!lodash-es)',
  ],
  moduleNameMapper: {
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$':
      '<rootDir>/jest/mocks/images.tsx',
    '^lodash-es$': 'lodash',
    '/axios/': 'axios/dist/node/axios.cjs',
    uuid: require.resolve('uuid'),
    nanoid: require.resolve('nanoid'),
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  resetMocks: true,
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
  moduleDirectories: ['node_modules'],
  modulePathIgnorePatterns: [
    '/dist/',
    '<rootDir>/packages/super-components',
    'packages/manager/apps/container/src/__tests__/navbar/navbar.spec.tsx',
  ],
};
