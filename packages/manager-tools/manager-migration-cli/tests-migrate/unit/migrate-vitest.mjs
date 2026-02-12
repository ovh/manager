import { existsSync } from 'fs';
import path from 'path';

import { applicationsBasePath } from '../../utils/AppUtils.mjs';
import { updateConfiguration } from './steps/updateConfiguration.mjs';
import { updateDependencies } from './steps/updateDependencies.mjs';
import { updateTestScripts } from './steps/updateScripts.mjs';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const onlyIndex = args.findIndex((arg) => arg === '--only');
const appName = onlyIndex !== -1 ? args[onlyIndex + 1] : null;

if (!appName) {
  console.error('❌ Missing app name. Use: --only <app-name>');
  process.exit(1);
}

const applicationPath = path.resolve(applicationsBasePath, appName);

if (!existsSync(applicationPath)) {
  console.error(`❌ App not found at: ${applicationPath}`);
  process.exit(1);
}

console.log(`🚀 Starting Vitest migration for: ${appName}`);
if (dryRun) console.log('🧪 Running in dry-run mode');

(async () => {
  await updateDependencies(applicationPath, dryRun);
  await updateTestScripts(applicationPath, dryRun);
  await updateConfiguration(applicationPath, dryRun);

  console.log(`✅ Finished Vitest migration for: ${appName}`);
})();
