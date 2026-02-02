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
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'react/prop-types': 'off',
      'react/jsx-key': 'off'
    },
    overrides: [
      {
        files: ['*.config.*js', '*.config.ts'],
        parserOptions: {
          project: null,
        },
      },
    ],
  };
  