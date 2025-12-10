#!/usr/bin/env node
import { ESLINT_DEP_REGEX, EXCLUDED_ESLINT_FILES } from '../../../utils/DependenciesUtils.mjs';
import { runCleanupStep } from '../../../utils/WorkspaceUtils.mjs';

const appName = process.argv[2];
const isDryRun = process.argv.includes('--dry-run');

const matchDevDep = (name) => ESLINT_DEP_REGEX.test(name);
const matchScript = () => false;

runCleanupStep({
  stepName: 'ESLint',
  appName,
  isDryRun,
  matchDevDep,
  matchScript,
  removeFilePaths: EXCLUDED_ESLINT_FILES,
}).catch((err) => {
  console.error('❌ Unexpected error during cleanup:', err);
  process.exit(1);
});
