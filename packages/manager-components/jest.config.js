module.exports = {
  testEnvironment: 'jsdom',
  transformIgnorePatterns: [
    'node_modules/(?!lodash-es|@ovh-ux|@ovhcloud|@stencil)',
  ],
  setupFilesAfterEnv: ['./jest.setup.ts'],
  collectCoverageFrom: ['src/components/**/**.component.tsx'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testMatch: ['<rootDir>/src/components/**/**/*.spec.tsx'],
  moduleNameMapper: {
    '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$':
      '<rootDir>/src/_mock_/images.tsx',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
