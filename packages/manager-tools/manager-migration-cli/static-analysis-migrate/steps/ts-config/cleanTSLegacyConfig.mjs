#!/usr/bin/env node
import { TS_EXCLUDED_DEPENDENCIES } from '../../../utils/DependenciesUtils.mjs';
import { runCleanupStep } from '../../../utils/WorkspaceUtils.mjs';

const appName = process.argv[2];
const isDryRun = process.argv.includes('--dry-run');
const matchDevDep = (name) => TS_EXCLUDED_DEPENDENCIES?.includes?.(name);

runCleanupStep({
  stepName: 'TypeScript',
  appName,
  isDryRun,
  matchDevDep,
}).catch((err) => {
  console.error('❌ Unexpected error during cleanup:', err);
  process.exit(1);
});
