module.exports = {
  projects: [
    {
      preset: 'ts-jest',
      setupFilesAfterEnv: ['<rootDir>/jest/mocks/jest.setup.js'],
      collectCoverageFrom: [
        'packages/**/*.{js,jsx,ts,tsx}',
        '!packages/**/*.d.ts',
      ],
      testMatch: [
        '<rootDir>/packages/components/ovh-shell/**/*.{spec,test}.{js,jsx,ts,tsx}',
        '<rootDir>/packages/manager/apps/container/**/*.{spec,test}.{js,jsx,ts,tsx}',
        '<rootDir>/packages/core/url-builder/**/*.{spec,test}.{js,jsx,ts,tsx}',
      ],
      testEnvironment: 'jest-environment-jsdom',
      transform: {
        '^.+\\.(js|jsx|mjs|cjs|ts|tsx|scss)$':
          '<rootDir>/node_modules/babel-jest',
        '^.+\\.css$': '<rootDir>/jest/mocks/cssMock.js',
      },
      transformIgnorePatterns: [
        'node_modules/(?!lodash-es|@ovhcloud|@stencil|@ovh-ux|uuid|jest-cucumber)',
        '^.+\\.module\\.(css|sass|scss)$',
        '<rootDir>/node_modules/(?!lodash-es|@stencil)',
      ],
      testPathIgnorePatterns: ['/node_modules/'],
      moduleNameMapper: {
        '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
        '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$':
          '<rootDir>/jest/mocks/images.tsx',
        '^lodash-es$': 'lodash',
        '@ovh-ux/manager-core-api':
          '<rootDir>/packages/manager/core/api/src/index.ts',
        '@ovh-ux/manager-react-shell-client':
          '<rootDir>/packages/manager/core/shell-client/src/index.tsx',
        '/axios/': 'axios/dist/node/axios.cjs',
        uuid: require.resolve('uuid'),
        nanoid: require.resolve('nanoid'),
      },
      moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
      resetMocks: true,
      globals: {
        'ts-jest': {
          isolatedModules: true,
          diagnostics: false,
        },
      },
      moduleDirectories: ['node_modules'],
      modulePathIgnorePatterns: ['/dist/', 'packages/manager/apps/container'],
    },
  ],
};
