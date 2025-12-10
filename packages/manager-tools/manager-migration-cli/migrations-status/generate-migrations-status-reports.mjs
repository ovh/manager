#!/usr/bin/env node
import { renderMergedReport } from '../utils/ExportUtils.mjs';
import { runMigration } from '../utils/ScriptUtils.mjs';

const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');

const typeArgIndex = args.findIndex((arg) => arg === '--type');
const selectedType =
  typeArgIndex !== -1 && args[typeArgIndex + 1] && !args[typeArgIndex + 1].startsWith('--')
    ? args[typeArgIndex + 1]
    : null;

const formatArgIndex = args.findIndex((arg) => arg === '--format');
const format =
  formatArgIndex !== -1 && args[formatArgIndex + 1] && !args[formatArgIndex + 1].startsWith('--')
    ? args[formatArgIndex + 1]
    : null;

const validFormats = ['json', 'html'];
if (format && !validFormats.includes(format)) {
  console.error(`❌ Invalid --format "${format}". Must be one of: ${validFormats.join(', ')}`);
  process.exit(1);
}

const allSteps = {
  routes: 'node ./migrations-status/steps/generate-routes-migrations-status-report.mjs',
  tests: 'node ./migrations-status/steps/generate-tests-migrations-status-report.mjs',
  swc: 'node ./migrations-status/steps/generate-swc-migrations-status-report.mjs',
  'static-kit': 'node ./migrations-status/steps/generate-static-kit-migrations-status-report.mjs',
  w3c: 'node ./migrations-status/steps/generate-w3c-a11y-migrations-status-report.mjs --type=w3c',
  a11y: 'node ./migrations-status/steps/generate-w3c-a11y-migrations-status-report.mjs --type=a11y',
  pnpm: 'node ./migrations-status/steps/generate-pnpm-migrations-status-report.mjs',
  all: 'ALL_TYPES',
};

if (selectedType && !Object.keys(allSteps).includes(selectedType)) {
  console.error(
    `❌ Invalid --type "${selectedType}". Must be one of: ${Object.keys(allSteps).join(', ')}`,
  );
  process.exit(1);
}

const steps = (
  selectedType && selectedType !== 'all'
    ? [selectedType]
    : Object.keys(allSteps).filter((type) => type !== 'all')
).map((type) => {
  const script = allSteps[type];
  const formatFlag = format ? `--format ${selectedType === 'all' ? 'json' : format}` : '';
  const dryRunFlag = isDryRun ? '--dry-run' : '';
  return `${script} ${formatFlag} ${dryRunFlag}`.trim();
});

runMigration({
  commandLabel: 'migrations-status',
  scriptOrSteps: steps,
  dryRun: isDryRun,
  statusOnly: true,
  docLink:
    '/development-guidelines/update-react-routes/ & /development-guidelines/update-unit-tests/ & /development-guidelines/vite-swc-migration/',
  onEnd: () => {
    if (selectedType !== 'all') return;
    renderMergedReport({ format });
  },
});
