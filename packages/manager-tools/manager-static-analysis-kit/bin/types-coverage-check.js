#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import { toCliArgs } from '../dist/adapters/types-coverage/helpers/type-coverage-config-utils.js';
import { typesCoverageConfig } from '../dist/configs/types-coverage-config.js';
import { logError, logInfo, logWarn } from './cli-utils.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '../../..');
const outputRootDir = path.resolve(__dirname, '../../../..');
const appsDir = path.join(rootDir, 'manager/apps');
const typeCoverageBin = path.resolve(__dirname, '../node_modules/.bin/typescript-coverage-report');
const typeCoverageDirName = 'types-coverage';

/**
 * Run TypeScript coverage for one app.
 */
function runTypeCoverage(appDir, appShort) {
  const outputDir = path.join(outputRootDir, typeCoverageDirName, appShort);
  fs.mkdirSync(outputDir, { recursive: true });

  logInfo(`Running type coverage for ${appShort} → ${outputDir}`);

  const coverageArgs = toCliArgs(typesCoverageConfig);

  const result = spawnSync(typeCoverageBin, coverageArgs, {
    cwd: appDir,
    stdio: 'inherit',
    shell: true,
  });

  if (result.status !== 0) {
    logError(`❌ Type coverage failed for ${appShort}`);
    return;
  }

  const distReport = path.join(appDir, 'coverage-ts');
  if (fs.existsSync(distReport)) {
    fs.cpSync(distReport, outputDir, { recursive: true });
    logInfo(`✅ Coverage report copied to ${outputDir}`);
  } else {
    logWarn(`⚠️ Expected coverage-ts folder not found at ${distReport}`);
  }
}

/**
 * Main CLI entrypoint.
 */
function main() {
  try {
    if (!fs.existsSync(typeCoverageBin)) {
      logError(`typescript-coverage-report binary not found at ${typeCoverageBin}`);
      return;
    }

    // CLI option: --app <name>
    const appArgIndex = process.argv.indexOf('--app');
    if (appArgIndex === -1 || !process.argv[appArgIndex + 1]) {
      logError('Missing --app <name>');
      process.exit(1);
    }

    const appName = process.argv[appArgIndex + 1];
    const appDir = path.join(appsDir, appName);

    if (!fs.existsSync(appDir)) {
      logError(`App not found: ${appName}`);
      process.exit(1);
    }

    const pkg = JSON.parse(fs.readFileSync(path.join(appDir, 'package.json'), 'utf-8'));
    const appShort = pkg.name.replace(/^@ovh-ux\//, '');

    runTypeCoverage(appDir, appShort);
  } catch (err) {
    logError(`Fatal error: ${err.stack || err.message}`);
    process.exit(1);
  }
}

main();
