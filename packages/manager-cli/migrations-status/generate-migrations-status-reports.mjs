#!/usr/bin/env node

import { runMigration } from '../utils/ScriptUtils.mjs';

// Parse CLI args
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');

const typeArgIndex = args.findIndex((arg) => arg === '--type');
const selectedType = typeArgIndex !== -1 &&
args[typeArgIndex + 1] &&
!args[typeArgIndex + 1].startsWith('--')
  ? args[typeArgIndex + 1]
  : null;

const allSteps = {
  routes: 'node ./migrations-status/steps/generate-routes-migrations-status-report.mjs',
  tests: 'node ./migrations-status/steps/generate-tests-migrations-status-report.mjs',
  swc: 'node ./migrations-status/steps/generate-swc-migrations-status-report.mjs'
};

if (selectedType && !Object.keys(allSteps).includes(selectedType)) {
  console.error(`❌ Invalid --type "${selectedType}". Must be one of: ${Object.keys(allSteps).join(', ')}`);
  process.exit(1);
}

const steps = selectedType
  ? [allSteps[selectedType]]
  : Object.values(allSteps);

// Execute migration status steps
runMigration({
  commandLabel: 'migrations-status',
  scriptOrSteps: steps,
  dryRun: isDryRun,
  statusOnly: true,
  formatGlob: '*.tsx',
  docLink: '/development-guidelines/update-react-routes/ & /development-guidelines/update-unit-tests/ & /development-guidelines/vite-swc-migration/',
});
