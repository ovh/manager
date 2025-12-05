module.exports = {
  extends: [
    '../../../../.eslintrc.js',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
  ],
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions: {
    project: ['./tsconfig.json', './tsconfig.build.json'],
    tsconfigRootDir: __dirname,
  },
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
    'arrow-body-style': ['error', 'as-needed'],
    'prefer-const': 'error',
    'react/jsx-curly-brace-presence': [
      'error',
      { props: 'never', children: 'never' },
    ],
    'react/jsx-boolean-value': ['error', 'never'],
  },
  overrides: [
    {
      files: ['*.config.*js', '*.config.ts'],
      parserOptions: { project: null },
    },
  ],
};
