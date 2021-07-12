module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  overrides: [
    {
      files: ['*.ts'],
      rules: {
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        'import/extensions': 'off',
        'no-use-before-define': 'off',
        'no-shadow': 'off',
        '@typescript-eslint/no-use-before-define': ['error'],
        '@typescript-eslint/no-shadow': ['error'],
      },
    },
  ],
};
