module.exports = {
  testEnvironment: 'jsdom',
  transformIgnorePatterns: [
    'node_modules/(?!lodash-es|@ovh-ux|@ovhcloud|@stencil)',
  ],
  testMatch: ['<rootDir>/src/components/**/*.spec.tsx'],
  collectCoverageFrom: ['src/components/**/**.component.tsx'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$':
      '<rootDir>/src/_mock_/images.tsx',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
