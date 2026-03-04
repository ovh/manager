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
    "import/extensions": "off",
    "no-param-reassign": "off",
    "@typescript-eslint/no-shadow": 'off',
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-unused-expressions': 'off',
    'import/order': 'off',
    '@typescript-eslint/ban-types': 'off',
    'consistent-return': 'off',
    'no-nested-ternary': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    'no-return-await': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    'eqeqeq': 'off',
    'array-callback-return': 'off',
    'consistent-return': 'off',
    'no-useless-escape': 'off',
    'no-plusplus': 'off',
    'no-new-object': 'off',
    'no-self-assign': 'off'
  },
};
