module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.(js|jsx|mjs|cjs|ts|tsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!lodash-es|@ovhcloud|@stencil|@ovh-ux)',
  ],
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
  collectCoverageFrom: ['src/**/**.component.tsx'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$':
      '<rootDir>/src/_mock_/images.tsx',
    '^@/(.*)$': '<rootDir>/src/$1',
    '/axios/': 'axios/dist/node/axios.cjs',
    uuid: require.resolve('uuid'),
    nanoid: require.resolve('nanoid'),
  },
};
