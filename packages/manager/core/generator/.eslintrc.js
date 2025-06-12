module.exports = {
  overrides: [
    {
      files: ['*.ts.hbs', '*.tsx.hbs'],
      parser: '@typescript-eslint/parser',
      rules: {
        'import/no-extraneous-dependencies': 'off',
      },
    },
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
    },
  ],
};