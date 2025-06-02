module.exports = {
  globals: { mocha: true, WEBPACK_ENV: {} },
  clearMocks: true,
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleFileExtensions: ['js', 'json', 'html', 'node'],
  transformIgnorePatterns: ['node_modules/?!lodash-es'],
  testMatch: ['**/__tests__/**/*.spec.js'],
  transform: {
    '\\.html$': '<rootDir>/client/__tests__/jest-html.loader.js',
    '^.+\\.js$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.(css|scss|png|less|svg)$': 'identity-obj-proxy',
    '^@ovh-ux/manager-components$':
      '<rootDir>/../../modules/manager-components/src/index.js',
    '^@ovh-ux/manager-(.*)$': '<rootDir>/../../modules/$1/src/index.js',
    '^@ovh-ux/ng-(.*)$': '<rootDir>/../../../components/ng-$1/src/index.js',
  },
  collectCoverage: false,
  collectCoverageFrom: ['client/app/**/*.js', '!client/__tests__/**/*'],
  coverageReporters: ['text-summary'],
};
