const typeEnum = require('@commitlint/config-angular-type-enum');

module.exports = {
  extends: ['@commitlint/config-angular'],
  rules: {
    // Enforce lowercase for header (type(scope): title)
    'header-case': [2, 'always', 'lower-case'],
    'subject-case': [2, 'always', 'lower-case'],
    'subject-exclamation-mark': [1, 'always'],
    'scope-case': [2, 'always', 'lower-case'],
    'scope-enum': [2, 'always'],
    'scope-empty': [2, 'never'],
    // Enforce a blank line between header and body
    'body-leading-blank': [2, 'always'],

    // Enforce 'ref: MANAGER-123' format in the footer
    'references-empty': [2, 'never'],
    // Enforce Signed-off-by footer format
    'signed-off-by': [2, 'always', 'Signed-off-by:'],

    // Enforce BREAKING CHANGE format in the footer
    'footer-empty': [1, 'never'],

    // Enforce specific commit types (feat, fix, etc.)
    'type-enum': [2, 'always', [
      'feat', 'fix', 'chore', 'docs', 'style', 'refactor', 'test', 'perf', 'sync', 'release'
    ]],

    'subject-max-length': [2, 'always', 100],
    'header-max-length': [2, 'always', 72],
  },
    "parserPreset": {
      "parserOpts": {
        "issuePrefixes": ["MANAGER-"]
      }
    }
};
