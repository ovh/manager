import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import path, { dirname, resolve, join } from 'path';
import { isCodeFileExistsSync } from './CodeTransformUtils.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const basePath = path.resolve('../manager/apps');

export const runMigration = ({
  appName,
  commandLabel,
  scriptOrSteps,
  formatGlob = '*.{js,ts,tsx}',
  framework = null,
  dryRun = false,
  docLink = null,
}) => {
  const appPath = path.join(basePath, appName);
  const isValidAppName = /^[a-zA-Z0-9_-]+$/.test(appName);

  if (!appName || !isValidAppName || !isCodeFileExistsSync(appPath)) {
    console.error(
      [
        `❌ Unable to proceed: invalid or missing application setup.`,
        '',
        `Possible issues:`,
        `  - App name is missing or invalid: "${appName}"`,
        `  - App folder not found at: ${appPath}`,
        '',
        `Usage: yarn manager-cli ${commandLabel} --app <app-name> ${framework ? '[--framework <name>] ' : ''}[--dry-run]`,
      ].join('\n'),
    );
    process.exit(1);
  }

  try {
    console.log(`🔄 Starting ${commandLabel} for app: ${appName}${framework ? ` using ${framework}` : ''}`);

    if (Array.isArray(scriptOrSteps)) {
      for (const cmd of scriptOrSteps) {
        const finalCmd = `${cmd} ${appName}${dryRun ? ' --dry-run' : ''}`;
        console.log(`📦 Running: ${finalCmd}`);
        execSync(finalCmd, { stdio: 'inherit' });
      }
    } else {
      const migrateScript = `./${commandLabel}/migrate-${framework || 'default'}.mjs`;
      const migrateCommand = `node ${migrateScript} ${dryRun ? '--dry-run' : ''} --only ${appName}`;
      execSync(migrateCommand, { stdio: 'inherit' });
    }

    console.log(`✅ ${commandLabel} completed for "${appName}".`);
  } catch (error) {
    console.error(
      [
        `❌ Failed during the ${commandLabel} process.`,
        '',
        docLink ? `See: ${docLink}` : '',
        '',
        'Please check the logs above for more details.',
      ].join('\n'),
    );
    console.error(error);
    process.exit(1);
  }

  if (dryRun) process.exit(0);

  const appFullPath = join('packages', 'manager', 'apps', appName, '**', formatGlob);

  try {
    console.log('📦 Running yarn install to apply dependency changes...');
    execSync('yarn install', {
      stdio: 'inherit',
      cwd: resolve(__dirname, '../..'),
    });
  } catch (error) {
    console.error('❌ Failed to refresh dependencies automatically.');
    console.error(error);
  }

  try {
    console.log('🎨 Formatting code with Prettier...');
    execSync(`yarn prettier --write "${appFullPath}"`, {
      stdio: 'inherit',
      cwd: resolve(__dirname, '../..'),
    });
  } catch (error) {
    console.error('❌ Failed to format code automatically.');
    console.error(error);
  }

  try {
    console.log('🧹 Applying ESLint fixes...');
    execSync(`yarn eslint "${appFullPath}" --fix --quiet`, {
      stdio: 'inherit',
      cwd: resolve(__dirname, '../..'),
    });
  } catch (error) {
    console.error('❌ ESLint encountered issues while fixing your code.');
    console.error(error);
  }

  // 🧪 If migration is related to tests, run the app's test suite
  if (commandLabel === 'unit-tests') {
    try {
      console.log(`🧪 Running tests for app "${appName}" to verify migration...`);
      execSync(`yarn workspace @ovh-ux/manager-${appName}-app test`, {
        stdio: 'inherit',
        cwd: resolve(__dirname, '../..'),
      });
    } catch (error) {
      console.error('❌ Test suite failed after migration.');
      console.error(error);
      process.exit(1);
    }
  }
}
