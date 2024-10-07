const isCI = process.env.CI;

module.exports = {
  default: {
    paths: ['e2e/features/**/*.feature'],
    require: [
      '../../../../playwright-helpers/bdd-setup.ts',
      'e2e/**/*.step.ts',
    ],
    requireModule: ['ts-node/register'],
    format: [
      'summary',
      isCI ? 'progress' : 'progress-bar',
      !isCI && ['html', 'e2e/reports/cucumber-results-report.html'],
      !isCI && ['usage-json', 'e2e/reports/cucumber-usage-report.json'],
    ].filter(Boolean),
    formatOptions: { snippetInterface: 'async-await' },
    retry: 1,
  },
};
