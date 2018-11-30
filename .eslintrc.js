const path = require('path');

module.exports = {
  root: true,
  parser: 'babel-eslint',
  extends: 'airbnb-base',
  env: {
    browser: true,
    jquery: true,
  },
  rules: {
    'no-bitwise': ['error', { allow: ['~'] }],
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
  },
  settings: {
    'import/resolver': {
      'eslint-import-resolver-lerna': {
        packages: path.resolve(__dirname, 'packages'),
      }
    }
  },
}



