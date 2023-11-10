module.exports = {
  default: {
    paths: ['features/**/*.feature'],
    require: [
      '../../../../playwright-helpers/bdd-setup.ts',
      './mock/bdd-mock-setup.ts',
      'src/**/*.step.ts',
    ],
    requireModule: ['ts-node/register'],
    format: ['summary', 'progress-bar'],
    formatOptions: { snippetInterface: 'async-await' },
  },
};
