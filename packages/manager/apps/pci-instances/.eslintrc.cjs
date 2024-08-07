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
  },
};
