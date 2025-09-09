#!/usr/bin/env node
import { runMigration } from '../utils/ScriptUtils.mjs';

const appName = process.argv[2];
const isDryRun = process.argv.includes('--dry-run');

runMigration({
  appName,
  commandLabel: 'routes',
  scriptOrSteps: [
    'node ./routes-migrate/steps/transform-routes-cli.mjs',
    'node ./routes-migrate/steps/update-routers-init-cli.mjs',
  ],
  formatGlob: '*.tsx',
  dryRun: isDryRun,
  docLink: '/development-guidelines/update-react-routes/',
});
