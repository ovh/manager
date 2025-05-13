module.exports = {
  extends: [
    '../../../../.eslintrc.js',
    'plugin:react/recommended',
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
    'import/extensions': 'off',
  },
};
