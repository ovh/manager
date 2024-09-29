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
      { devDependencies: true, peerDependencies: true },
    ],
    'import/no-unresolved': 0,
    'prettier/prettier': 'warn',
    'import/extensions': 'off',
    'import/no-cycle': 'off',
    'import/prefer-default-export': 'off',
    'no-useless-constructor': 'off',
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
  ],
};
