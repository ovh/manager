module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  overrides: [{
    files: ["**/*.md"],
    rules: {
      "no-undef": "off",
      "import/no-extraneous-dependencies": "off"
    }
  }]
};
