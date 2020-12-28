module.exports = {
  root: true,
  parser: 'babel-eslint',
  plugins: ['angular', 'markdown', 'prettier'],
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
  ],
};
