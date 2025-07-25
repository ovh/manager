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
    'import/extensions': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
    'react/jsx-boolean-value': ['error', 'never'],
    'arrow-body-style': ["error", "as-needed"],
    'prefer-const': 'error',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { ignoreRestSiblings: true },
    ],
  },
};
