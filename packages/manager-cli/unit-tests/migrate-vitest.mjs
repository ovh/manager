import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';
import { updateDependencies } from './steps/updateDependencies.mjs';
import { updateTestScripts } from './steps/updateScripts.mjs';
import { updateConfiguration } from './steps/updateConfiguration.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const onlyIndex = args.findIndex((arg) => arg === '--only');
const appName = onlyIndex !== -1 ? args[onlyIndex + 1] : null;

if (!appName) {
  console.error('❌ Missing app name. Use: --only <app-name>');
  process.exit(1);
}

const appPath = path.resolve(__dirname, '../../manager/apps', appName);

if (!existsSync(appPath)) {
  console.error(`❌ App not found at: ${appPath}`);
  process.exit(1);
}

console.log(`🚀 Starting Vitest migration for: ${appName}`);
if (dryRun) console.log('🧪 Running in dry-run mode');

(async () => {
  await updateDependencies(appPath, dryRun);
  await updateTestScripts(appPath, dryRun);
  await updateConfiguration(appPath, dryRun);

  console.log(`✅ Finished Vitest migration for: ${appName}`);
})();
