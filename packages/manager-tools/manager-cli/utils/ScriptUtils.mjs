#!/usr/bin/env node
import { execSync } from 'child_process';
import path, { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';

import { applicationsBasePath } from './AppUtils.mjs';
import { isCodeFileExistsSync } from './CodeTransformUtils.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Parse CLI arguments into a structured object.
 *
 * Supports:
 *   --dry-run
 *   --format=console|json|html  OR  --format console
 *   --outDir=dir
 *   --file=path
 *   --app=name
 *   <positional app name>
 *
 * Unrecognized args are collected in `rest`.
 */
export function parseCliArgs(argv) {
  const out = {
    app: undefined,
    dryRun: false,
    format: 'console',
    outDir: 'target',
    file: undefined,
    type: undefined, // a11y | w3c | ...
    rest: [],
  };

  const [, , ...args] = argv;
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--dry-run') {
      out.dryRun = true;
    } else if (arg.startsWith('--format=')) {
      out.format = arg.split('=')[1] || out.format;
    } else if (arg === '--format' && args[i + 1]) {
      out.format = args[i + 1];
      i++;
    } else if (arg.startsWith('--outDir=')) {
      out.outDir = arg.split('=')[1] || out.outDir;
    } else if (arg.startsWith('--file=')) {
      out.file = arg.split('=')[1] || out.file;
    } else if (arg.startsWith('--app=')) {
      out.app = arg.split('=')[1];
    } else if (!out.app && !arg.startsWith('--')) {
      out.app = arg;
    } else if (arg.startsWith('--type=')) {
      out.type = arg.split('=')[1];
    } else if (arg === '--type' && args[i + 1]) {
      out.type = args[i + 1];
      i++;
    } else {
      out.rest.push(arg);
    }
  }

  return out;
}

/**
 * Runs a migration or setup process for a specific app or globally.
 *
 * Supports dry-run, formatter/linter post-processing, and test verification.
 *
 * @param {Object} options - Configuration options for the migration.
 * @param {string|null} [options.appName=null] - Name of the application (e.g., 'zimbra'), or null for global run.
 * @param {string} options.commandLabel - Label describing the migration operation (e.g., 'tests-migrate').
 * @param {string|string[]} options.scriptOrSteps - Path(s) to migration script(s), or CLI steps to invoke.
 * @param {string} [options.formatGlob='*.{js,ts,tsx}'] - Glob pattern for files to format/lint.
 * @param {string|null} [options.framework=null] - Optional framework name (e.g., 'react', 'vue').
 * @param {string|null} [options.testType=null] - Optional test type (e.g., 'unit', 'integration').
 * @param {string|null} [options.testCommand=null] - Optional test command to run (e.g., 'test:unit').
 * @param {boolean} [options.dryRun=false] - Whether to perform a dry run (no writes or changes).
 * @param {string|null} [options.docLink=null] - Optional link to documentation in case of failure.
 * @param {boolean} [options.statusOnly=false] - Whether to skip mutation and only report status.
 * @param {boolean} [options.enablePrettier=true] - Whether to run Prettier on affected files.
 * @param {boolean} [options.enableLintFix=true] - Whether to run ESLint with auto-fix after migration.
 * @param {() => void} [options.onEnd=() => {}] - Callback function to run at the end (e.g., for cleanup).
 */
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
  enablePrettier = true,
  enableLintFix = true,
  onEnd = () => {},
}) => {
  const appPath = appName ? path.join(applicationsBasePath, appName) : null;

  if (appName) {
    const isValidAppName = /^[a-zA-Z0-9_-]+$/.test(appName);

    if (!isValidAppName || !isCodeFileExistsSync(appPath)) {
      console.error(
        [
          `❌ Unable to proceed: invalid or missing application setup.`,
          '',
          `Possible issues:`,
          `  - App name is missing or invalid: "${appName}"`,
          `  - App folder not found at: ${appPath}`,
          '',
          `Usage: yarn manager-cli ${commandLabel} --app <app-name> ${
            framework ? '[--framework <name>] ' : ''
          }${
            commandLabel.includes('tests-migrate') ? '--testType <unit|integration> ' : ''
          }[--dry-run]`,
        ].join('\n'),
      );
      process.exit(1);
    }

    console.log(
      `🔄 Starting ${commandLabel}${
        testType ? ` (${testType} tests)` : ''
      } for app: ${appName}${framework ? ` using ${framework}` : ''}`,
    );
  } else {
    console.log(`🔄 Running ${commandLabel}${dryRun ? ' in dry-run mode' : ''}`);
  }

  try {
    if (Array.isArray(scriptOrSteps)) {
      for (const cmd of scriptOrSteps) {
        const finalCmd = [
          cmd,
          appName || '',
          dryRun ? '--dry-run' : '',
          testType ? `--testType ${testType}` : '',
        ]
          .filter(Boolean)
          .join(' ');
        console.log(`📦 Running: ${finalCmd}`);
        execSync(finalCmd, { stdio: 'inherit' });
      }
    } else {
      const migrateScript = testType
        ? `./${commandLabel}/${testType}/migrate-${framework || 'default'}.mjs`
        : `./${commandLabel}/migrate-${framework || 'default'}.mjs`;
      const migrateCommand = [
        'node',
        migrateScript,
        dryRun ? '--dry-run' : '',
        appName ? `--only ${appName}` : '',
      ]
        .filter(Boolean)
        .join(' ');
      execSync(migrateCommand, { stdio: 'inherit' });
    }

    if (appName) {
      console.log(`✅ ${commandLabel} completed for "${appName}".`);
    } else {
      console.log(`✅ ${commandLabel} completed.`);
    }
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

  if ((dryRun || statusOnly) && typeof onEnd === 'function') {
    onEnd();
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

  if (enablePrettier) {
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
  }

  if (enableLintFix) {
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

  if ((dryRun || statusOnly) && typeof onEnd === 'function') {
    onEnd();
  }
};
