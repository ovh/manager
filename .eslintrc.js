const path = require('path');

module.exports = {
  root: true,
  parser: 'babel-eslint',
  extends: 'airbnb-base',
  env: {
    browser: true,
    jquery: true,
  },
  globals: {
    d3: true,
    JSURL: true,
  },
  rules: {
    'no-bitwise': ['error', { allow: ['~'] }],
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'import/no-unresolved': 0,
  },
  settings: {
    'import/resolver': {
      'eslint-import-resolver-lerna': {
        packages: [
          path.resolve(__dirname, 'packages/manager/apps'),
          path.resolve(__dirname, 'packages/manager/modules'),
        ]
      }
    }
  },
}
