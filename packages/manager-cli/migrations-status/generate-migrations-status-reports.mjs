#!/usr/bin/env node

import { runMigration } from '../utils/ScriptUtils.mjs';

const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');

const typeArgIndex = args.findIndex((arg) => arg === '--type');
const selectedType = typeArgIndex !== -1 &&
args[typeArgIndex + 1] &&
!args[typeArgIndex + 1].startsWith('--')
  ? args[typeArgIndex + 1]
  : null;

const formatArgIndex = args.findIndex((arg) => arg === '--format');
const format = formatArgIndex !== -1 &&
args[formatArgIndex + 1] &&
!args[formatArgIndex + 1].startsWith('--')
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
  swc: 'node ./migrations-status/steps/generate-swc-migrations-status-report.mjs'
};

if (selectedType && !Object.keys(allSteps).includes(selectedType)) {
  console.error(`❌ Invalid --type "${selectedType}". Must be one of: ${Object.keys(allSteps).join(', ')}`);
  process.exit(1);
}

const steps = (selectedType ? [selectedType] : Object.keys(allSteps)).map((type) => {
  const script = allSteps[type];
  const formatFlag = format ? `--format ${format}` : '';
  const dryRunFlag = isDryRun ? '--dry-run' : '';
  return `${script} ${formatFlag} ${dryRunFlag}`.trim();
});

runMigration({
  commandLabel: 'migrations-status',
  scriptOrSteps: steps,
  dryRun: isDryRun,
  statusOnly: true,
  formatGlob: '*.tsx',
  docLink: '/development-guidelines/update-react-routes/ & /development-guidelines/update-unit-tests/ & /development-guidelines/vite-swc-migration/',
});
