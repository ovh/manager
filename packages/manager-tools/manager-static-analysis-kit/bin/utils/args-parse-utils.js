import process from 'node:process';

import { codeDuplicationConfig } from '../../dist/configs/code-duplication-config.js';
import { typesCoverageConfig } from '../../dist/configs/types-coverage-config.js';
import { logError, logInfo } from './log-utils.js';
import { getModule } from './module-utils.js';

/**
 * Parse CLI arguments to resolve target modules (apps, packages, or libraries).
 *
 * This function looks for one of the supported flags in `process.argv`:
 * - `--apps` or `--app`
 * - `--packages` or `--package`
 * - `--libraries` or `--library`
 *
 * Each flag must be followed by a comma-separated list of module identifiers.
 * Each identifier is resolved using {@link getModule}, which returns a module descriptor.
 *
 * For every valid pattern:
 * - The corresponding module descriptor (containing `fullPath`, `shortPath`, and `packageName`)
 *   is added to the result list.
 * - If a module cannot be resolved, an error is logged and it is skipped.
 *
 * @typedef {Object} ModuleDescriptor
 * @property {string} fullPath - Absolute path to the module directory.
 * @property {string} shortPath - Folder name (short identifier) of the module.
 * @property {string} packageName - Full npm package name (e.g. "@ovh-ux/manager-core-shell").
 *
 * @returns {ModuleDescriptor[] | null}
 * Array of resolved module descriptors, or `null` if no supported CLI flags were provided.
 *
 * @example
 * // Example 1: Apps mode
 * // CLI: --apps zimbra,web
 * parseArgs();
 * // → [
 * //   { fullPath: "/.../manager/apps/zimbra", shortPath: "zimbra", packageName: "@ovh-ux/manager-zimbra-app" },
 * //   { fullPath: "/.../manager/apps/web", shortPath: "web", packageName: "@ovh-ux/manager-web-app" }
 * // ]
 *
 * @example
 * // Example 2: Libraries mode
 * // CLI: --libraries core-shell,react-components
 * parseArgs();
 * // → [
 * //   { fullPath: "/.../packages/manager/core/core-shell", shortPath: "core-shell", packageName: "@ovh-ux/manager-core-shell" },
 * //   { fullPath: "/.../packages/components/react-components", shortPath: "react-components", packageName: "@ovh-ux/manager-react-components" }
 * // ]
 */
export function parseArgs() {
  const libsArg = process.argv.find((arg) => arg === '--libraries' || arg === '--library');
  const packagesArg = process.argv.find((arg) => arg === '--packages' || arg === '--package');
  const appsArg = process.argv.find((arg) => arg === '--apps' || arg === '--app');

  const moduleModeArgs = libsArg || packagesArg || appsArg;

  if (!moduleModeArgs) return null;

  const index = process.argv.indexOf(moduleModeArgs);
  const rawValue = process.argv[index + 1] || '';

  const modulePatterns = rawValue
    .split(',')
    .map((n) => n.trim())
    .filter(Boolean);

  /** @type {ModuleDescriptor[]} */
  const modules = [];

  for (const modulePattern of modulePatterns) {
    const discoveredModule = getModule(modulePattern, !!libsArg);
    if (discoveredModule) {
      modules.push(discoveredModule);
    } else {
      logError(
        `❌ Module ${modulePattern} → folder ${discoveredModule?.shortPath || 'unknown'} not found, skipping`,
      );
    }
  }

  logInfo(
    `patterns ${modulePatterns.join(', ')} → folders: ${modules
      .map((item) => item.fullPath)
      .join(', ')}`,
  );

  return modules;
}

/**
 * Alias for {@link parseArgs}, used for semantic clarity in CLI entrypoints.
 *
 * This function simply delegates to {@link parseArgs} and returns the same result.
 *
 * @returns {ModuleDescriptor[] | null}
 * Array of resolved module descriptors, or `null` if no valid flags were provided.
 *
 * @example
 * parseCliTargets();
 * // Equivalent to parseArgs(), typically used in CLI commands.
 */
export function parseCliTargets() {
  return parseArgs();
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
  // jscpd accepts regex patterns via `--ignore-pattern` (singular).
  // Multiple regexes should be joined by comma.
  // https://github.com/kucherenko/jscpd/blob/master/apps/jscpd/README.md#ignore-pattern
  if (Array.isArray(cfg.ignorePatterns) && cfg.ignorePatterns.length > 0) {
    for (const pat of cfg.ignorePatterns) {
      args.push('--ignore-pattern', `'${pat}'`);
    }
  }
  return args;
}
