const COMMIT_TYPES = ['build', 'chore', 'ci', 'docs', 'feat', 'fix', 'perf', 'refactor', 'revert', 'style', 'test', 'sync', 'release'];
const SUBJECT_CASE_TYPES = ['lower-case', 'start-case', 'pascal-case', 'upper-case'];

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Enforce lowercase for header (type(scope): title)
    'subject-case': [2, 'always', SUBJECT_CASE_TYPES],
    'scope-case': [2, 'always', 'lower-case'],
    'scope-empty': [2, 'never'],
    // Enforce a blank line between header and body
    'body-leading-blank': [2, 'always'],

    // Enforce 'ref: MANAGER-123' format in the footer
    'references-empty': [1, 'never'],
    // Enforce Signed-off-by footer format
    'signed-off-by': [2, 'always', 'Signed-off-by:'],
    // Enforce specific commit types (feat, fix, etc.)
    'type-enum': [2, 'always', COMMIT_TYPES],
    'header-max-length': [2, 'always', 100],
    'footer-leading-blank' : [2, 'always']
  }
};
