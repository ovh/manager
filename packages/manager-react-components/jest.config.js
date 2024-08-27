module.exports = {
  testMatch: ['<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}'],
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    customExportConditions: [''],
  },
  transformIgnorePatterns: [
    'node_modules/(?!lodash-es|@ovh-ux|@ovhcloud|@stencil)',
  ],
  setupFilesAfterEnv: ['./jest.setup.ts'],
  collectCoverageFrom: ['src/components/**/*.component.tsx', 'src/hooks/**/*'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$':
      '<rootDir>/src/_mock_/images.tsx',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
