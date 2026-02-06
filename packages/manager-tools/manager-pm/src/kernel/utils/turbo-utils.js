import path from 'node:path';

/**
 * @typedef {(args: string[], index: number) => { value: string|null, nextIndex: number }} FlagValueRead
 */

/**
 * Check whether the provided runner represents Turbo.
 * Accepts: "turbo", "/usr/local/bin/turbo", "C:\\tools\\turbo.exe"
 *
 * @param {string} runner
 * @returns {boolean}
 */
export function isTurboRunner(runner) {
  if (typeof runner !== 'string') return false;
  const trimmed = runner.trim();
  if (!trimmed) return false;

  const baseName = path.basename(trimmed).toLowerCase();
  return baseName === 'turbo' || baseName === 'turbo.exe' || baseName === 'turbo.cmd';
}

/**
 * Read a flag value either from:
 *  - "--flag value"
 *  - "--flag=value"
 *
 * If the flag has no value, returns { value: null, nextIndex: index }.
 *
 * @param {string[]} args
 * @param {number} index
 * @param {string} flagName - e.g. "--outputStyle"
 * @returns {{ value: string|null, nextIndex: number }}
 */
function readFlagValue(args, index, flagName) {
  const current = args[index];

  // --flag=value
  if (current.startsWith(`${flagName}=`)) {
    return { value: current.slice(flagName.length + 1), nextIndex: index };
  }

  // --flag value
  if (current === flagName) {
    const next = args[index + 1];
    if (typeof next === 'string' && !next.startsWith('-')) {
      return { value: next, nextIndex: index + 1 };
    }
  }

  return { value: null, nextIndex: index };
}

/**
 * Nx often uses: stream / stream-without-prefixes / dynamic / static
 * Turbo doesn't have a perfect 1:1 mapping; this is a pragmatic “don’t crash” mapping.
 *
 * @param {string} value
 * @returns {string|null}
 */
function mapNxOutputStyleToTurboOutputLogs(value) {
  const normalized = String(value || '').toLowerCase();

  if (normalized.startsWith('stream')) return '--output-logs=full';
  if (normalized === 'static') return '--output-logs=new-only';
  if (normalized === 'dynamic') return '--output-logs=full';

  return null;
}

/**
 * Handle Nx -> Turbo: --outputStyle <v> / --outputStyle=<v>
 *
 * @param {string[]} args
 * @param {number} index
 * @param {string[]} out
 * @returns {number|null} The new index to continue from, or null if not handled
 */
function normalizeOutputStyleArg(args, index, out) {
  const current = args[index];
  if (current !== '--outputStyle' && !current.startsWith('--outputStyle=')) return null;

  const { value, nextIndex } = readFlagValue(args, index, '--outputStyle');
  if (!value) return nextIndex;

  const mapped = mapNxOutputStyleToTurboOutputLogs(value);
  if (mapped) out.push(mapped);

  return nextIndex;
}

/**
 * Handle Nx -> Turbo: --parallel 4 / --parallel=4  ==> --concurrency=4
 * If no numeric value exists, keep "--parallel" as-is.
 *
 * @param {string[]} args
 * @param {number} index
 * @param {string[]} out
 * @returns {number|null} The new index to continue from, or null if not handled
 */
function normalizeParallelArg(args, index, out) {
  const current = args[index];
  if (current !== '--parallel' && !current.startsWith('--parallel=')) return null;

  const { value, nextIndex } = readFlagValue(args, index, '--parallel');
  if (!value) {
    out.push('--parallel');
    return nextIndex;
  }

  out.push(`--concurrency=${value}`);
  return nextIndex;
}

/**
 * Normalize Nx cache flag into Turbo equivalent.
 * Nx:   --skip-nx-cache (boolean)
 * Turbo: --no-cache     (boolean)
 *
 * @param {string[]} args
 * @param {number} index
 * @param {string[]} out
 * @returns {number|null} New index if handled, otherwise null
 */
function normalizeSkipNxCacheArg(args, index, out) {
  const current = args[index];

  // --skip-nx-cache
  if (current === '--skip-nx-cache') {
    out.push('--no-cache');
    return index;
  }

  // --skip-nx-cache=true|false
  if (current.startsWith('--skip-nx-cache=')) {
    const raw = current.slice('--skip-nx-cache='.length).trim().toLowerCase();
    const truthy = raw !== 'false' && raw !== '0' && raw !== 'no' && raw !== 'off';
    if (truthy) out.push('--no-cache');
    return index;
  }

  // --skip-nx-cache true|false
  if (current === '--skip-nx-cache') {
    const next = args[index + 1];
    if (typeof next === 'string' && !next.startsWith('-')) {
      const raw = next.trim().toLowerCase();
      const truthy = raw !== 'false' && raw !== '0' && raw !== 'no' && raw !== 'off';
      if (truthy) out.push('--no-cache');
      return index + 1;
    }

    out.push('--no-cache');
    return index;
  }

  return null;
}

/**
 * Capture Nx SCM flags to later build a Turbo --filter SCM expression.
 * Nx:   --base <ref> / --base=<ref>
 *       --head <ref> / --head=<ref>
 *
 * @param {string[]} args
 * @param {number} index
 * @param {{ baseRef: string|null, headRef: string|null }} scm
 * @returns {number|null}
 */
function captureNxScmArg(args, index, scm) {
  const current = args[index];

  if (current === '--base' || current.startsWith('--base=')) {
    const { value, nextIndex } = readFlagValue(args, index, '--base');
    if (value) scm.baseRef = value;
    return nextIndex;
  }

  if (current === '--head' || current.startsWith('--head=')) {
    const { value, nextIndex } = readFlagValue(args, index, '--head');
    if (value) scm.headRef = value;
    return nextIndex;
  }

  return null;
}

/**
 * Turbo SCM filter works with local refs; remote prefixes often break.
 * Example: ...[origin/develop...feat/x] -> ...[develop...feat/x]
 *
 * @param {string} filterValue
 * @returns {string}
 */
function normalizeTurboScmFilterValue(filterValue) {
  let filter = String(filterValue ?? '').trim();

  // Strip surrounding quotes
  if (
    filter.length >= 2 &&
    filter[0] === filter[filter.length - 1] &&
    (filter[0] === '"' || filter[0] === "'")
  ) {
    filter = filter.slice(1, -1);
  }

  // Only sanitize SCM-style filter expressions
  const isScmFilterExpression =
    (filter.startsWith('...[') || filter.startsWith('[')) && filter.endsWith(']');

  if (!isScmFilterExpression) {
    return filterValue;
  }

  // Remove common remote prefixes not available in local git context
  filter = filter.replace(/\borigin\//g, '');

  // Defensive fix for previously observed typo (orgin → origin → removed)
  filter = filter.replace(/\borgin\//g, '');

  return filter;
}

/**
 * Normalize CI args when the effective runner is Turbo.
 * Goal: avoid passing Nx-only flags to Turbo when Nx falls back to Turbo.
 *
 * Examples:
 * - "--outputStyle=stream" (Nx) => "--output-logs=full"
 * - "--parallel 4" (Nx)       => "--concurrency=4"
 *
 * @param {string[]} args
 * @returns {string[]}
 */
export function normalizeTurboCiArgs(args = []) {
  /** @type {string[]} */
  const normalizedCliArgs = [];

  const scmRevisionRange = { baseRef: null, headRef: null };
  let hasUserProvidedFilter = false;

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];

    // Normalize --filter / --filter=... and track explicit user filters
    if (arg === '--filter') {
      const next = args[i + 1];
      hasUserProvidedFilter = true;

      if (typeof next === 'string' && !next.startsWith('-')) {
        normalizedCliArgs.push('--filter', normalizeTurboScmFilterValue(next));
        i += 1;
      } else {
        normalizedCliArgs.push('--filter');
      }
      continue;
    }

    if (arg.startsWith('--filter=')) {
      hasUserProvidedFilter = true;
      const value = arg.slice('--filter='.length);
      normalizedCliArgs.push(`--filter=${normalizeTurboScmFilterValue(value)}`);
      continue;
    }

    const consumedArgIndex =
      normalizeOutputStyleArg(args, i, normalizedCliArgs) ??
      normalizeParallelArg(args, i, normalizedCliArgs) ??
      normalizeSkipNxCacheArg(args, i, normalizedCliArgs) ??
      captureNxScmArg(args, i, scmRevisionRange);

    if (consumedArgIndex !== null) {
      i = consumedArgIndex;
      continue;
    }

    normalizedCliArgs.push(arg);
  }

  // Convert Nx SCM args into Turbo filter when no user filter is provided
  if (!hasUserProvidedFilter && (scmRevisionRange.baseRef || scmRevisionRange.headRef)) {
    const base = scmRevisionRange.baseRef || 'HEAD^1';
    const head = scmRevisionRange.headRef || 'HEAD';
    normalizedCliArgs.unshift('--filter', `...[${base}...${head}]`);
  }

  return normalizedCliArgs;
}
