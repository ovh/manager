const path = require('path');

module.exports = {
  root: true,
  parser: 'babel-eslint',
  plugins: [
    'angular',
    'markdown',
    'prettier',
  ],
  extends: ['airbnb-base', 'prettier'],
  env: {
    'angular/mocks': true,
    browser: true,
    jquery: true,
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
  settings: {
    'import/resolver': {
      'eslint-import-resolver-lerna': {
        packages: [
          path.resolve(__dirname, 'packages/manager/apps'),
          path.resolve(__dirname, 'packages/manager/modules'),
          path.resolve(__dirname, 'packages/manager/tools'),
        ],
      },
    },
  },
};
