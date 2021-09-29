module.exports = {
  env: {
    jest: true,
  },
  extends: [
    '../../../../.eslintrc.js',
    'plugin:react/recommended',
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'import/extensions': 'off',
  },
};
