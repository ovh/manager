#!/usr/bin/env node
import { runMigration } from '../utils/ScriptUtils.mjs';

const appName = process.argv[2];

runMigration({
  appName,
  commandLabel: 'translations',
  scriptOrSteps: ['node ./translations-checker/steps/check-duplicated-cli.mjs'],
  statusOnly: true,
});
