#!/usr/bin/env node

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import path, { dirname, resolve, join } from 'path';
import { isCodeFileExistsSync } from './CodeTransformUtils.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const basePath = path.resolve('../manager/apps');

export const runMigration = ({
   appName = null,
   commandLabel,
   scriptOrSteps,
   formatGlob = '*.{js,ts,tsx}',
   framework = null,
   testType = null,
   testCommand = null,
   dryRun = false,
   docLink = null,
   statusOnly = false,
}) => {
  const appPath = appName ? path.join(basePath, appName) : null;

  if (appName) {
    const isValidAppName = /^[a-zA-Z0-9_-]+$/.test(appName);

    if (!isValidAppName || !isCodeFileExistsSync(appPath)) {
      console.error([
        `❌ Unable to proceed: invalid or missing application setup.`,
        '',
        `Possible issues:`,
        `  - App name is missing or invalid: "${appName}"`,
        `  - App folder not found at: ${appPath}`,
        '',
        `Usage: yarn manager-cli ${commandLabel} --app <app-name> ${framework ? '[--framework <name>] ' : ''}${commandLabel.includes('tests-migrate') ? '--testType <unit|integration> ' : ''}[--dry-run]`,
      ].join('\n'));
      process.exit(1);
    }

    console.log(`🔄 Starting ${commandLabel}${testType ? ` (${testType} tests)` : ''} for app: ${appName}${framework ? ` using ${framework}` : ''}`);
  } else {
    console.log(`🔄 Running ${commandLabel}${dryRun ? ' in dry-run mode' : ''}`);
  }

  try {
    if (Array.isArray(scriptOrSteps)) {
      for (const cmd of scriptOrSteps) {
        const finalCmd = [
          cmd,
          appName ? appName : '',
          dryRun ? '--dry-run' : '',
          testType ? `--testType ${testType}` : '',
        ].filter(Boolean).join(' ');
        console.log(`📦 Running: ${finalCmd}`);
        execSync(finalCmd, { stdio: 'inherit' });
      }
    } else {
      const migrateScript = testType
        ? `./${commandLabel}/${testType}/migrate-${framework || 'default'}.mjs`
        : `./${commandLabel}/migrate-${framework || 'default'}.mjs`;
      const migrateCommand = [
        'node', migrateScript,
        dryRun ? '--dry-run' : '',
        appName ? `--only ${appName}` : ''
      ].filter(Boolean).join(' ');
      execSync(migrateCommand, { stdio: 'inherit' });
    }

    if (appName) {
      console.log(`✅ ${commandLabel} completed for "${appName}".`);
    } else {
      console.log(`✅ ${commandLabel} completed.`);
    }

  } catch (error) {
    console.error([
      `❌ Failed during the ${commandLabel} process.`,
      '',
      docLink ? `See: ${docLink}` : '',
      '',
      'Please check the logs above for more details.',
    ].join('\n'));
    console.error(error);
    process.exit(1);
  }

  if (dryRun || !appName || statusOnly) return;

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

  if (testCommand) {
    try {
      console.log(`🧪 Running tests for app "${appName}" to verify migration...`);
      execSync(`yarn workspace @ovh-ux/manager-${appName}-app ${testCommand}`, {
        stdio: 'inherit',
        cwd: resolve(__dirname, '../..'),
      });
    } catch (error) {
      console.error(`❌ ${testCommand} failed after migration.`);
      console.error(error);
      process.exit(1);
    }
  }
};
