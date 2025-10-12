#!/usr/bin/env node
import { runMigration } from '../utils/ScriptUtils.mjs';

const args = process.argv.slice(2);
const appName = args[0];
const isDryRun = args.includes('--dry-run');

if (!appName || appName.startsWith('--')) {
  console.error(
    '❌ Missing required <app-name> argument.\nUsage: yarn manager-cli static-analysis-migrate --app <name> [--dry-run]',
  );
  process.exit(1);
}

runMigration({
  appName,
  commandLabel: 'static-analysis-migrate',
  scriptOrSteps: [
    'node ./static-analysis-migrate/steps/eslint-config/cleanEslintLegacyConfig.mjs',
    'node ./static-analysis-migrate/steps/eslint-config/addEslintStaticKitConfig.mjs',
    'node ./static-analysis-migrate/steps/ts-config/cleanTSLegacyConfig.mjs',
    'node ./static-analysis-migrate/steps/ts-config/addTSStaticKitConfig.mjs',
    'node ./static-analysis-migrate/steps/ide-config/generateIDEIntegrationConfig.mjs',
  ],
  dryRun: isDryRun,
  docLink: '/development-guidelines/static-analysis-kit-migration/',
  enableLintFix: false,
});
