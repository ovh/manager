module.exports = {
  default: {
    paths: ['e2e/features/**/*.feature'],
    require: [
      '../../../../playwright-helpers/bdd-setup.ts',
      'e2e/**/*.step.ts',
    ],
    requireModule: ['ts-node/register'],
    format: ['summary', 'progress-bar'],
    formatOptions: { snippetInterface: 'async-await' },
  },
};
