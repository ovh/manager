module.exports = {
  root: true,
  parser: 'babel-eslint',
  plugins: ['angular', 'markdown', 'prettier'],
  extends: ['airbnb-base', 'prettier'],
  env: {
    'angular/mocks': true,
    browser: true,
    jquery: true,
    jest: true,
  },
  globals: {
    fixture: false,
    test: false,
  },
  rules: {
    'no-bitwise': ['error', { allow: ['~'] }],
    'import/no-extraneous-dependencies': [
      'error',
      {
        // This is required to avoid unwanted lint issues in unit test files
        // due to dependencies like vitest or @testing-library being dev-only.
        devDependencies: [
          '**/*.test.{js,ts,tsx}',
          '**/*.spec.{js,ts,tsx}',
          '**/test-setup.{js,ts,tsx}',
          '**/test.setup.{js,ts,tsx}',
          '**/setupTests.{js,ts,tsx}',
          '**/testUtils.{js,ts,tsx}',
          '**/*.config.{js,ts}',
          '**/scripts/**/*.{js,ts}',
          '**/cli/**/*.{js,ts}',
          '**/tools/**/*.{js,ts}',
        ],
        peerDependencies: true,
      },
    ],
    'import/no-unresolved': 0,
    'prettier/prettier': 'warn',
    'import/extensions': 'off',
    'import/no-cycle': 'off',
    'import/prefer-default-export': 'off',
  },
  ignorePatterns: [
    '**/vendor/**',
    '**/node_modules/**',
    '**/dist/**',
    '**/www/**',
    '**/custom-elements/**',
    '**/custom-elements-bundle/**',
    '**/react/src/**',
    '**/vue/src/**',
    '**/loader/**',
    '**/templates/**',
  ],
  overrides: [
    {
      files: ['**/*.md'],
      rules: {
        'import/no-extraneous-dependencies': 'off',
        'import/extensions': 'off',
        'no-undef': 'off',
        'no-unused-vars': 'off',
      },
    },
    {
      files: ['**/*.ts', '**/*.tsx'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      extends: [
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
      ],
      rules: {
        'no-underscore-dangle': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        'import/extensions': 'off',
        'no-use-before-define': 'off',
        'no-shadow': 'off',
        'no-unused-expressions': 'off',
        camelcase: 'off',
        '@typescript-eslint/camelcase': 'off',
        '@typescript-eslint/no-unused-expressions': ['error'],
        '@typescript-eslint/no-use-before-define': ['error'],
        '@typescript-eslint/no-shadow': ['error'],
        '@typescript-eslint/naming-convention': [
          'error',
          {
            selector: 'variable',
            format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
          },
          {
            selector: 'parameter',
            format: ['camelCase'],
            leadingUnderscore: 'allow',
          },
          {
            selector: 'memberLike',
            modifiers: ['private'],
            format: ['camelCase'],
            leadingUnderscore: 'allow',
          },
          {
            selector: 'typeLike',
            format: ['PascalCase'],
          },
        ],
      },
    },
    {
      files: ['*.spec.js', 'jest.config.js'],
      env: {
        mocha: true,
        node: true,
        jest: true,
      },
    },
    {
      files: ['*.test.ts', '*.step.ts', '*.spec.ts'],
      extends: [
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
      ],
      rules: {
        'func-names': 'off',
      },
      env: {
        mocha: true,
        node: true,
        jest: true,
      },
    },
    {
      files: [
        '**/App.tsx',
        '**/test.{setup,provider}.tsx',
        '**/vitest.config.{js,ts,mjs}',
        '**/tests-setup/src/index.js',
        '**/__tests__/**/*.{ts,tsx}',
        '**/*.{test,spec,step}.{ts,tsx}',
        '**/*.{mock,Mock,MOCK,Mocked,Mocking}*.{ts,tsx}',
        '**/*Test*.{ts,tsx}',
      ],
      rules: {
        'import/no-extraneous-dependencies': 'off',
      },
      env: {
        mocha: true,
        node: true,
        jest: true,
      },
    },
  ],
};
