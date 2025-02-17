const typeEnum = require('@commitlint/config-angular-type-enum');
const types = [...typeEnum.value(), 'sync', 'release', 'build', 'ci', 'revert', 'style'];
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Enforce lowercase for header (type(scope): title)
    'header-case': [2, 'always', 'lower-case'],
    'subject-case': [2, 'always', 'lower-case'],
    'subject-exclamation-mark': [0, 'always'],
    'scope-case': [2, 'always', 'lower-case'],
    'scope-enum': [2, 'always'],
    'scope-empty': [2, 'never'],
    // Enforce a blank line between header and body
    'body-leading-blank': [2, 'always'],

    // Enforce 'ref: MANAGER-123' format in the footer
    'references-empty': [2, 'never'],
    // Enforce Signed-off-by footer format
    'signed-off-by': [2, 'always', 'Signed-off-by:'],
    'footer-empty': [0, 'always'],
    // Enforce specific commit types (feat, fix, etc.)
    'type-enum': [2, 'always', types],

    'subject-max-length': [2, 'always', 100],
    'header-max-length': [2, 'always', 72],
  }
};
