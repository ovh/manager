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
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'import/no-unresolved': 0,
    'prettier/prettier': 'error',
  },
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
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        'import/extensions': 'off',
        'import/prefer-default-export': 'off',
        'no-use-before-define': 'off',
        'no-shadow': 'off',
        'no-unused-expressions': 'off',
        'camelcase': 'off',
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
  ],
};
