const path = require('path');

module.exports = {
  extends: [
    '../../../../.eslintrc.js',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:prettier/recommended',
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
  globals: {
    __VERSION__: true,
  },

  rules: {
    '@typescript-eslint/no-unused-vars': [
      'error',
      { ignoreRestSiblings: true },
    ],
    '@typescript-eslint/no-unnecessary-condition': 'error',
  },
  overrides: [
    {
      files: ['*.js', '*.cjs', '*.mjs'],
      rules: {
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-unnecessary-condition': 'off',
      },
    },
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        project: [path.resolve(__dirname, 'tsconfig.json')],
      },
      rules: {
        '@typescript-eslint/no-unused-vars': [
          'error',
          { ignoreRestSiblings: true },
        ],
        '@typescript-eslint/no-unnecessary-condition': 'error',
      },
    },
  ],
};
