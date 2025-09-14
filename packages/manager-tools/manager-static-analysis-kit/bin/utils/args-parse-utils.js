import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

import { codeDuplicationConfig } from '../../dist/configs/code-duplication-config.js';
import { typesCoverageConfig } from '../../dist/configs/types-coverage-config.js';
import { isReactApp } from './apps-utils.js';
import { logError, logInfo, logWarn } from './log-utils.js';

/**
 * Extract an app folder name from an OVH Manager package name.
 *
 * Example:
 *   "@ovh-ux/manager-zimbra-app" → "zimbra"
 *
 * @param {string} packageName - Full npm package name.
 * @returns {string|null} The extracted app folder name, or null if the format is invalid.
 */
function extractAppFolderFromPackageName(packageName) {
  const match = packageName.match(/^@ovh-ux\/manager-(.+)-app$/);
  if (!match) {
    logError(`❌ Invalid package name format: ${packageName}`);
    return null;
  }
  return match[1];
}

/**
 * Parse CLI arguments for `--apps` or `--app` flags.
 *
 * Accepts a comma-separated list of app folder names. Example:
 *   `--apps zimbra,web`
 *
 * @param {string} appsDir - Absolute path to the apps root directory.
 * @returns {{appFolders: string[], packageNames: string[]} | null}
 *   Object containing valid app folders and an empty `packageNames` array,
 *   or null if no `--apps`/`--app` flag is provided.
 */
function parseAppsArg(appsDir) {
  const appsArg = process.argv.find((arg) => arg === '--apps' || arg === '--app');
  if (!appsArg) return null;

  const index = process.argv.indexOf(appsArg);
  const rawValue = process.argv[index + 1] || '';
  const appFolders = rawValue
    .split(',')
    .map((n) => n.trim())
    .filter(Boolean);

  const validFolders = appFolders.filter((folder) => {
    if (!fs.existsSync(path.join(appsDir, folder))) {
      logError(`❌ App not found: ${folder} → skipping`);
      return false;
    }
    return true;
  });

  logInfo(`Running in apps mode for: ${validFolders.join(', ')}`);
  return { appFolders: validFolders, packageNames: [] };
}

/**
 * Parse CLI arguments for `--packages` or `--package` flags.
 *
 * Accepts a comma-separated list of package names. Example:
 *   `--packages @ovh-ux/manager-zimbra-app,@ovh-ux/manager-web-app`
 *
 * Each package name is mapped to its corresponding app folder.
 *
 * @param {string} appsDir - Absolute path to the apps root directory.
 * @returns {{appFolders: string[], packageNames: string[]} | null}
 *   Object mapping package names to discovered app folders,
 *   or null if no `--packages`/`--package` flag is provided.
 */
function parsePackagesArg(appsDir) {
  const packagesArg = process.argv.find((arg) => arg === '--packages' || arg === '--package');
  if (!packagesArg) return null;

  const index = process.argv.indexOf(packagesArg);
  const rawValue = process.argv[index + 1] || '';
  const packageNames = rawValue
    .split(',')
    .map((n) => n.trim())
    .filter(Boolean);

  const mappedFolders = [];
  for (const pkgName of packageNames) {
    const folder = extractAppFolderFromPackageName(pkgName);
    if (folder && fs.existsSync(path.join(appsDir, folder))) {
      mappedFolders.push(folder);
    } else {
      logError(`❌ Package ${pkgName} → app folder ${folder} not found, skipping`);
    }
  }

  logInfo(
    `Running in packages mode for: ${packageNames.join(', ')} → apps: ${mappedFolders.join(', ')}`,
  );
  return { appFolders: mappedFolders, packageNames };
}

/**
 * Discover all React apps in the apps directory when no CLI flags are provided.
 *
 * Only apps that contain a `package.json` file and are identified as React apps
 * (via `isReactApp`) will be included.
 *
 * @param {string} appsDir - Absolute path to the apps root directory.
 * @returns {{appFolders: string[], packageNames: string[]}}
 *   Object containing discovered app folders and an empty `packageNames` array.
 */
function discoverApps(appsDir) {
  const discoveredAppFolders = fs.readdirSync(appsDir).filter((dir) => {
    const pkgPath = path.join(appsDir, dir, 'package.json');
    return fs.existsSync(pkgPath) && isReactApp(pkgPath);
  });

  if (discoveredAppFolders.length === 0) {
    logWarn('⚠️ No React apps found to analyze.');
    return { appFolders: [], packageNames: [] };
  }

  logInfo(`Running in auto-discovery mode (${discoveredAppFolders.length} apps).`);
  return { appFolders: discoveredAppFolders, packageNames: [] };
}

/**
 * Parse CLI arguments to resolve which apps or packages should be analyzed.
 *
 * Priority order:
 *  1. Explicit `--apps` flag
 *  2. Explicit `--packages` flag
 *  3. Auto-discovery fallback
 *
 * @param {string} appsDir - Absolute path to the apps root directory.
 * @returns {{appFolders: string[], packageNames: string[]}}
 *   Object containing app folder names and package names for analysis.
 */
export function parseCliTargets(appsDir) {
  return parseAppsArg(appsDir) || parsePackagesArg(appsDir) || discoverApps(appsDir);
}

/**
 * Build CLI arguments for `typescript-coverage-report` from config.
 *
 * @param {string} outputDir - Output directory for the report.
 * @returns {string[]} Array of CLI arguments.
 */
export function buildTypesCoverageArgs(outputDir) {
  const args = ['--outputDir', outputDir];

  const mapping = {
    threshold: '--threshold',
    strict: '--strict',
    debug: '--debug',
    cache: '--cache',
    project: '--project',
    ignoreUnread: '--ignore-unread',
  };

  for (const [key, flag] of Object.entries(mapping)) {
    const value = typesCoverageConfig[key];
    if (value === undefined || value === false) continue;

    if (typeof value === 'boolean') {
      if (value) args.push(flag);
    } else {
      args.push(flag, String(value));
    }
  }

  // Handle array options separately
  if (Array.isArray(typesCoverageConfig.ignoreFiles)) {
    for (const pattern of typesCoverageConfig.ignoreFiles) {
      args.push('--ignore-files', pattern);
    }
  }

  return args;
}

/**
 * Translate our config → jscpd CLI flags.
 * @param {string} outputDir - output directory for jscpd reports
 * @returns {string[]}
 */
export function buildCodeDuplicationArgs(outputDir) {
  const cfg = codeDuplicationConfig;
  const args = [
    '--output',
    outputDir,
    '--reporters',
    Array.isArray(cfg.reporters) ? cfg.reporters.join(',') : String(cfg.reporters || 'console'),
    '--mode',
    cfg.mode,
    '--min-lines',
    String(cfg.minLines),
    '--min-tokens',
    String(cfg.minTokens),
    '--max-lines',
    String(cfg.maxLines),
    '--max-size',
    String(cfg.maxSize),
  ];

  if (cfg.threshold !== null && cfg.threshold !== undefined) {
    args.push('--threshold', String(cfg.threshold));
  }
  if (cfg.absolute) {
    args.push('--absolute');
  }
  if (Array.isArray(cfg.formats) && cfg.formats.length > 0) {
    args.push('--format', cfg.formats.join(','));
  }
  if (Array.isArray(cfg.ignore) && cfg.ignore.length > 0) {
    // jscpd accepts comma-separated ignore globs
    // https://github.com/kucherenko/jscpd/blob/master/apps/jscpd/README.md#ignore
    args.push('--ignore', cfg.ignore.join(','));
  }

  return args;
}
