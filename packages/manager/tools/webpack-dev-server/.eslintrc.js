module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  overrides: [{
    files: ["**/*.md"],
    rules: {
      "no-undef": "off",
      "no-unused-vars": "off",
      "import/no-extraneous-dependencies": "off"
    }
  }]
};
