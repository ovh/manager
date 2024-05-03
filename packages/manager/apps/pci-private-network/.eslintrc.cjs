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
    __VERSION__: true,
  },
  rules: {
    'import/extensions': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    'react/no-deprecated': 'off',
    'arrow-body-style': ['error', 'as-needed'],
  },
};
