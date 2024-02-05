module.exports = {
  extends: [
    '../../../../.eslintrc.js',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
  globals: {
    '__VERSION__': true,
  },
  rules: {
    'no-unused-vars': 'error',
    'import/extensions': 'off',
    'react/prop-types': 'off',
    'import/prefer-default-export': 'off',
    'import/order': 'warn',
    'global-require': 'off',
    'no-nested-ternary': 'off',
    'react/no-unescaped-entities': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
  },
};
