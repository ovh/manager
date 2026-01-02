import {
  buildApplicationWorkspacePath,
  getPackageNameFromApplication,
} from '../helpers/apps-workspace-helper.js';
import {
  buildModuleWorkspacePath,
  getPackageNameFromModule,
} from '../helpers/modules-workspace-helper.js';
import { logger } from './log-manager.js';

/**
 * @typedef {Object} NxCiState
 * @property {string[]} normalizedOptions
 * @property {boolean} hasAll
 * @property {boolean} hasProjectsFlag
 * @property {boolean} hasParallelFlag
 * @property {{base: string, head: string} | null} scmFilter
 */

/**
 * Create a fresh Nx CI normalization state.
 *
 * @returns {NxCiState}
 */
function createNxCiState() {
  return {
    normalizedOptions: [],
    hasAll: false,
    hasProjectsFlag: false,
    hasParallelFlag: false,
    scmFilter: null,
  };
}

/**
 * Normalize a project specifier for Nx:
 * - strip surrounding quotes
 * - strip leading "./" so Turbo-style directory filters still work
 *
 * @param {string} input
 * @returns {string}
 */
function normalizeNxProjectSpecifier(input) {
  let value = input.trim();

  // Remove surrounding quotes if present
  if (
    value.length >= 2 &&
    value[0] === value[value.length - 1] &&
    (value[0] === '"' || value[0] === "'")
  ) {
    value = value.slice(1, -1);
  }

  // Turbo directory filters often start with "./", Nx wants workspace-relative paths
  if (value.startsWith('./')) {
    value = value.slice(2);
  }

  return value;
}

/**
 * Interpret a Turbo-style --filter value for Nx.
 *
 * Supports:
 *  - Directory/name filters:
 *      "./packages/manager/core/*", "@ovh-ux/manager-core-api"
 *      => { type: "projects", value: "<spec>" }
 *  - Git/source-control filters (Turbo style):
 *      "...[HEAD^1]"                    // range from HEAD^1..HEAD
 *      "...[develop...feat/MANAGER-1]"  // range from develop..feat/MANAGER-1
 *      "[HEAD^1]"                       // also supported
 *      "[develop...feat/MANAGER-1]"     // also supported
 *
 * @param {string} raw
 * @returns {{type: "projects", value: string} | {type: "scm", base: string, head: string}}
 */
function normalizeNxOptions(raw) {
  let value = raw.trim();

  // Remove surrounding quotes if present: "...", '...'
  if (
    value.length >= 2 &&
    value[0] === value[value.length - 1] &&
    (value[0] === '"' || value[0] === "'")
  ) {
    value = value.slice(1, -1);
  }

  // Turbo SCM filters may start with "..." before the [range] part, e.g. "...[HEAD^1]"
  if (value.startsWith('...[')) {
    value = value.slice(3); // drop the "..." prefix, keep "[HEAD^1]" / "[base...head]"
  }

  // SCM-style filters: [HEAD^1], [main...feature], etc.
  if (value.startsWith('[') && value.endsWith(']')) {
    const inner = value.slice(1, -1).trim();

    if (inner.includes('...')) {
      // [base...head]
      const [baseRaw, headRaw] = inner.split('...', 2);
      const base = (baseRaw || 'main').trim();
      const head = (headRaw || 'HEAD').trim();
      return { type: 'scm', base, head };
    }

    // [HEAD^1] → base=HEAD^1, head=HEAD
    const base = (inner || 'HEAD^1').trim();
    return { type: 'scm', base, head: 'HEAD' };
  }

  // Everything else: treat as project/name/directory specifier
  return { type: 'projects', value };
}

/**
 * Handle Nx-native flags: --all, --projects, --projects=...
 *
 * @param {string} opt
 * @param {string[]} options
 * @param {number} index
 * @param {NxCiState} state
 * @returns {number | null} last consumed index or null if not handled
 */
function handleNxAllAndProjectsOption(opt, options, index, state) {
  if (opt === '--all') {
    state.hasAll = true;
    state.normalizedOptions.push(opt);
    return index;
  }

  if (opt === '--projects') {
    state.hasProjectsFlag = true;
    const next = options[index + 1];
    if (typeof next === 'string') {
      const spec = normalizeNxProjectSpecifier(next);
      state.normalizedOptions.push('--projects', spec);
      return index + 1;
    }
    return index;
  }

  if (opt.startsWith('--projects=')) {
    state.hasProjectsFlag = true;
    const raw = opt.slice('--projects='.length);
    const spec = normalizeNxProjectSpecifier(raw);
    state.normalizedOptions.push(`--projects=${spec}`);
    return index;
  }

  return null;
}

/**
 * Handle parallel / concurrency mapping:
 *  - keep --parallel / --parallel=...
 *  - map --concurrency / --concurrency=... → --parallel / --parallel=...
 *
 * @param {string} opt
 * @param {string[]} options
 * @param {number} index
 * @param {NxCiState} state
 * @returns {number | null}
 */
function handleNxParallelAndConcurrencyOption(opt, options, index, state) {
  // Nx-native parallel flags
  if (opt === '--parallel') {
    state.hasParallelFlag = true;
    state.normalizedOptions.push(opt);

    const next = options[index + 1];
    if (typeof next === 'string') {
      state.normalizedOptions.push(next);
      return index + 1;
    }
    return index;
  }

  if (opt.startsWith('--parallel=')) {
    state.hasParallelFlag = true;
    state.normalizedOptions.push(opt);
    return index;
  }

  // Turbo-style: --concurrency <n>
  if (opt === '--concurrency') {
    const next = options[index + 1];
    if (typeof next === 'string' && !next.startsWith('-') && !state.hasParallelFlag) {
      state.normalizedOptions.push('--parallel', next);
      state.hasParallelFlag = true;
      return index + 1;
    }
    // if no value or already have parallel, drop it
    return index;
  }

  // Turbo-style: --concurrency=n
  if (opt.startsWith('--concurrency=')) {
    if (!state.hasParallelFlag) {
      state.normalizedOptions.push(opt.replace('--concurrency=', '--parallel='));
      state.hasParallelFlag = true;
    }
    return index;
  }

  return null;
}

/**
 * Handle Turbo's --filter / --filter=...:
 *  - projects/dirs → --projects=<spec>
 *  - [HEAD^1] or [base...head] → record scmFilter for nx affected
 *
 * @param {string} opt
 * @param {string[]} options
 * @param {number} index
 * @param {NxCiState} state
 * @returns {number | null}
 */
function handleNxFilterOption(opt, options, index, state) {
  if (opt !== '--filter' && !opt.startsWith('--filter=')) {
    return null;
  }

  let rawValue;

  if (opt === '--filter') {
    rawValue = options[index + 1];
    index += 1;
  } else {
    rawValue = opt.slice('--filter='.length);
  }

  if (typeof rawValue === 'string') {
    const parsed = normalizeNxOptions(rawValue);

    if (parsed.type === 'scm') {
      state.scmFilter = { base: parsed.base, head: parsed.head };
    } else if (parsed.type === 'projects' && !state.hasProjectsFlag) {
      const spec = normalizeNxProjectSpecifier(parsed.value);
      state.normalizedOptions.push(`--projects=${spec}`);
      state.hasProjectsFlag = true;
    }
  }

  // We never pass --filter directly to Nx.
  return index;
}

/**
 * Normalize CI options for Nx:
 * - keep Nx-native flags as-is
 * - map `--concurrency` → `--parallel`
 * - map `--filter` → `--projects` or SCM filter metadata
 *
 * @param {string[]} options
 * @returns {{
 *   normalizedOptions: string[],
 *   hasAll: boolean,
 *   hasProjectsFlag: boolean,
 *   scmFilter: { base: string, head: string } | null
 * }}
 */
function normalizeNxCiOptions(options = []) {
  const state = createNxCiState();

  for (let i = 0; i < options.length; i += 1) {
    const opt = options[i];

    // Try each handler in order; if one consumes it, continue
    const handlers = [
      handleNxAllAndProjectsOption,
      handleNxParallelAndConcurrencyOption,
      handleNxFilterOption,
    ];

    let handled = false;

    for (const handle of handlers) {
      const newIndex = handle(opt, options, i, state);
      if (newIndex !== null) {
        i = newIndex; // skip consumed args
        handled = true;
        break;
      }
    }

    if (!handled) {
      state.normalizedOptions.push(opt);
    }
  }

  const { normalizedOptions, hasAll, hasProjectsFlag, scmFilter } = state;
  return { normalizedOptions, hasAll, hasProjectsFlag, scmFilter };
}

/**
 * Build Nx-specific CI args from normalized options.
 *
 * @param {"build"|"test"} task
 * @param {string[]} options
 * @returns {string[]}
 */
export function buildNxCiArgs(task, options = []) {
  const { normalizedOptions, hasAll, hasProjectsFlag, scmFilter } = normalizeNxCiOptions(options);

  if (scmFilter) {
    const base = scmFilter.base || 'main';
    const head = scmFilter.head || 'HEAD';

    return [
      'affected',
      `--target=${task}`,
      ...normalizedOptions,
      `--base=${base}`,
      `--head=${head}`,
    ];
  }

  const args = ['run-many', `--target=${task}`, ...normalizedOptions];

  if (!hasAll && !hasProjectsFlag) {
    args.push('--all');
  }

  return args;
}

/**
 * Internal helper: derive the best Turbo filter value for a given `appRef`.
 *
 * - Prefers the package name (`@scope/name`) if available.
 * - Falls back to the last path segment of the canonical workspace path.
 *
 * @param {string} appRef - Application reference (name, package name, or path).
 * @returns {string|null} The filter string for Turbo, or `null` if unresolved.
 */
export function resolveApplicationBuildFilter(appRef) {
  logger.debug(`resolveApplicationBuildFilter(appRef="${appRef}")`);

  if (!appRef) {
    logger.warn('⚠️ No appRef provided, returning null.');
    return null;
  }

  try {
    const packageName = getPackageNameFromApplication(appRef);
    if (packageName) {
      logger.info(`📦 Resolved build filter to package name: ${packageName}`);
      return packageName; // Prefer the package name (@scope/name)
    }

    const applicationWorkspacePath = buildApplicationWorkspacePath(appRef); // packages/manager/apps/<name>
    const applicationPathParts = applicationWorkspacePath.split('/');
    const applicationBuildFilter = applicationPathParts[applicationPathParts.length - 1] || null;

    if (!applicationBuildFilter) {
      logger.error(
        `❌ Failed to resolve build filter for appRef="${appRef}". Path: ${applicationWorkspacePath}`,
      );
      return null;
    }

    logger.info(`📂 Resolved build filter to workspace segment: ${applicationBuildFilter}`);

    return applicationBuildFilter;
  } catch (err) {
    logger.error(`❌ Exception in resolveBuildFilter for appRef="${appRef}": ${err.message}`);
    logger.debug(`Stack trace: ${err.stack}`);
    return null;
  }
}

/**
 * Internal helper: derive the best Turbo build filter for a given `moduleRef`.
 *
 * - Prefers the package name (`@scope/name`) if available.
 * - Falls back to the last path segment of the canonical workspace path.
 * - Handles modules under any of the supported roots:
 *   - `packages/manager-tools/**`
 *   - `packages/manager/core/**`
 *   - `packages/manager/modules/**`
 *
 * Example:
 * ```bash
 * yarn manager-pm --action build --module @ovh-ux/manager-core-api
 * yarn manager-pm --action test --module packages/manager/modules/foo
 * yarn manager-pm --action lint --module core-shell-client
 * ```
 *
 * @param {string} moduleRef - Module reference (name, package name, or path).
 * @returns {string|null} The Turbo filter string (usually a package name or last path segment),
 *                        or `null` if resolution failed.
 */
export function resolveModuleBuildFilter(moduleRef) {
  logger.debug(`resolveModuleBuildFilter(moduleRef="${moduleRef}")`);

  if (!moduleRef) {
    logger.warn('⚠️ No moduleRef provided, returning null.');
    return null;
  }

  try {
    // Prefer package name if resolvable
    const pkgName = getPackageNameFromModule(moduleRef);
    if (pkgName) {
      logger.info(`📦 Resolved module build filter to package name: ${pkgName}`);
      return pkgName;
    }

    // Fallback to workspace path segment
    const rel = buildModuleWorkspacePath(moduleRef); // e.g. packages/manager/core/api
    const parts = rel.split('/');
    const lastSegment = parts[parts.length - 1] || null;

    if (!lastSegment) {
      logger.error(`❌ Failed to resolve build filter for moduleRef="${moduleRef}". Path: ${rel}`);
      return null;
    }

    logger.info(`📂 Resolved module build filter to workspace segment: ${lastSegment}`);
    return lastSegment;
  } catch (err) {
    logger.error(`❌ Exception in resolveModuleBuildFilter for "${moduleRef}": ${err.message}`);
    logger.debug(`Stack trace: ${err.stack}`);
    return null;
  }
}
