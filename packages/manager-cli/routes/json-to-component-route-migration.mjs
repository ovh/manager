#!/usr/bin/env node

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import path, { dirname, resolve, join } from 'path';
import { isCodeFileExistsSync } from '../utils/CodeTransformUtils.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const basePath = path.resolve('../manager/apps');

const appName = process.argv[2];
const appPath = path.join(basePath, appName);

const isDryRun = process.argv.includes('--dry-run');
const isValidAppName = /^[a-zA-Z0-9_-]+$/.test(appName);

if (!appName || !isValidAppName || !isCodeFileExistsSync(appPath)) {
  console.error(
    [
      '❌ Unable to proceed: invalid or missing application setup.',
      '',
      'Possible issues:',
      `  - App name is missing: you must provide an app name.`,
      `  - App name is invalid: must match /^[a-zA-Z0-9_-]+$/`,
      `  - App folder or required files not found at: ${appPath}`,
      '',
      'Usage:',
      '  yarn routes-update <app-name> [--dry-run]',
      '',
      'Please check your input and ensure the app exists in the expected location.',
    ].join('\n'),
  );
  process.exit(1);
}

const migrateRoutes = async () => {
  try {
    const transformCommand = `node ./routes/transform-routes-cli.mjs ${appName}${isDryRun ? ' --dry-run' : ''}`;
    const updateCommand = `node ./routes/update-routers-init-cli.mjs ${appName}${isDryRun ? ' --dry-run' : ''}`;

    console.log(`🔄 Starting routes migration for app: ${appName}`);

    console.log(`📦 Running transformation script...`);
    execSync(transformCommand, { stdio: 'inherit' });

    console.log(`🔧 Updating router initialization...`);
    execSync(updateCommand, { stdio: 'inherit' });

    console.log(`✅ Routes successfully migrated for "${appName}".`);
  } catch (error) {
    console.error(
      [
        '❌ Failed during the route migration process.',
        '',
        'Please check the logs above for more details.',
        'You can refer to the documentation for guidance:',
        '📘 https://manager.pages.ovhcloud.tools/technical-documentation/manager/development-guidelines/update-react-routes/',
        '',
        'If the issue persists, contact the Control Tower Team.',
      ].join('\n'),
    );
    console.error(error);
    process.exit(1);
  }

  if(isDryRun){
    process.exit(0);
  }

  const appFullPath = join('packages', 'manager', 'apps', appName, '**', '*.tsx');

  try {
    console.log('🎨 Formatting code with Prettier...');
    execSync(`yarn prettier --write ${appFullPath}`, {
      stdio: 'inherit',
      cwd: resolve(__dirname, '../..'),
    });
  } catch (error) {
    console.error('❌ Failed to format code automatically. You may run the Prettier command manually.');
    console.error(error);
  }

  try {
    console.log('🧹 Applying ESLint fixes...');
    execSync(`yarn eslint ${appFullPath} --fix --quiet`, {
      stdio: 'inherit',
      cwd: resolve(__dirname, '../..'),
    });
  } catch (error) {
    console.error(
      [
        '❌ ESLint encountered issues while fixing your code.',
        '',
        'You may need to fix these issues manually. A common cause is missing or outdated dependencies:',
        '',
        'If you see an error about the import of ErrorBoundary (e.g., "import { ErrorBoundary } from \'@ovh-ux/manager-react-components\';"), ensure:',
        '  - For V1: "@ovh-ux/manager-react-components" ≥ 1.47.0',
        '  - For V2: "@ovh-ux/manager-react-components" ≥ 2.17.0',
        '',
        'Documentation:',
        '📘 https://manager.pages.ovhcloud.tools/technical-documentation/manager/development-guidelines/update-react-routes/',
        'Or contact the Control Tower Team.',
      ].join('\n'),
    );
    console.error(error);
  }
};

migrateRoutes().catch((err) => {
  console.error('❌ An unexpected error occurred:');
  console.error(err);
});
