const path = require('path');

module.exports = {
  root: true,
  parser: 'babel-eslint',
  plugins: ['angular', 'markdown', 'prettier', 'simple-import-sort'],
  extends: ['airbnb-base', 'prettier', 'plugin:import/recommended'],
  env: {
    'angular/mocks': true,
    browser: true,
    jquery: true,
  },
  rules: {
    'no-bitwise': ['error', { allow: ['~'] }],
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'import/no-unresolved': 'off',
    'simple-import-sort/sort': 'error', // sorts imports automatically
    'sort-imports': 'off', // must be turned off for 'simple-import-sort/sort' to work fine
    'import/order': 'off', // must be turned off for 'simple-import-sort/sort' to work fine
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
