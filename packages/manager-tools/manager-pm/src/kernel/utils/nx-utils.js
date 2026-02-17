import path from 'node:path';

/**
 * @typedef {Object} NxCiState
 * @property {string[]} normalizedOptions
 * @property {boolean} hasAll
 * @property {boolean} hasProjectsFlag
 * @property {boolean} hasParallelFlag
 * @property {{base: string, head: string} | null} scmFilter
 * @property {string|null} base
 * @property {string|null} head
 * @property {boolean} dryRunJson
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
    base: null,
    head: null,
    dryRunJson: false,
  };
}

/**
 * Normalize a project specifier for Nx:
 * - strip surrounding quotes
 * - strip leading "./" so Turbo-style directory filters still work
 * - strip turbo "..." suffix/prefix (not an Nx selector)
 *
 * @param {string} input
 * @returns {string}
 */
export function normalizeNxProjectSpecifier(input) {
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

  // Turbo selectors like "pkg..." or "...pkg" are not Nx project selectors.
  // We keep the project name/path only.
  if (value.endsWith('...')) value = value.slice(0, -3);
  if (value.startsWith('...')) value = value.slice(3);

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
export function normalizeNxOptions(raw) {
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
 * Capture explicit SCM args:
 * - --base / --base=...
 * - --head / --head=...
 *
 * These should NOT be forwarded to `nx run-many`; they trigger `nx affected`.
 *
 * @param {string} opt
 * @param {string[]} options
 * @param {number} index
 * @param {NxCiState} state
 * @returns {number | null}
 */
function handleNxBaseHeadOption(opt, options, index, state) {
  const readNext = () => {
    const next = options[index + 1];
    return typeof next === 'string' && !next.startsWith('-') ? next : null;
  };

  if (opt === '--base') {
    const v = readNext();
    if (v) state.base = v;
    return v ? index + 1 : index;
  }

  if (opt.startsWith('--base=')) {
    state.base = opt.slice('--base='.length);
    return index;
  }

  if (opt === '--head') {
    const v = readNext();
    if (v) state.head = v;
    return v ? index + 1 : index;
  }

  if (opt.startsWith('--head=')) {
    state.head = opt.slice('--head='.length);
    return index;
  }

  return null;
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
 *  - [HEAD^1] or [base...head] → record scmFilter for nx affected/show
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
 * Detect dry-run JSON mode.
 * Supports both:
 *  - --dry-run=json
 *  - --dry=json
 *  - --dry-run json
 *  - --dry json
 *
 * @param {string} opt
 * @param {string[]} options
 * @param {number} index
 * @param {NxCiState} state
 * @returns {number | null}
 */
function handleDryRunJsonOption(opt, options, index, state) {
  if (opt === '--dry-run=json' || opt === '--dry=json') {
    state.dryRunJson = true;
    return index;
  }

  if (opt === '--dry-run' || opt === '--dry') {
    const next = options[index + 1];
    if (next === 'json') {
      state.dryRunJson = true;
      return index + 1;
    }
    state.dryRunJson = true;
    return index;
  }

  return null;
}

/**
 * Consume turbo-only logging flags so they don't get forwarded to Nx:
 * - --output-logs / --output-logs=...
 * - --log-order / --log-order=...
 * - --log-prefix / --log-prefix=...
 * - --log-level / --log-level=...
 *
 * @param {string} opt
 * @param {string[]} options
 * @param {number} index
 * @returns {number | null}
 */
function handleTurboLogFlags(opt, options, index) {
  const consumeWithValue = () => {
    const next = options[index + 1];
    if (typeof next === 'string' && !next.startsWith('-')) return index + 1;
    return index;
  };

  if (
    opt === '--output-logs' ||
    opt === '--log-order' ||
    opt === '--log-prefix' ||
    opt === '--log-level'
  ) {
    return consumeWithValue();
  }

  if (
    opt.startsWith('--output-logs=') ||
    opt.startsWith('--log-order=') ||
    opt.startsWith('--log-prefix=') ||
    opt.startsWith('--log-level=')
  ) {
    return index;
  }

  return null;
}

/**
 * Normalize CI options for Nx:
 * - keep Nx-native flags as-is
 * - map `--concurrency` → `--parallel`
 * - map `--filter` → `--projects` or SCM filter metadata
 * - capture `--base/--head` (explicit SCM args)
 * - capture `--dry-run=json` and drop turbo log flags
 *
 * @param {string[]} options
 * @returns {{
 *   normalizedOptions: string[],
 *   hasAll: boolean,
 *   hasProjectsFlag: boolean,
 *   scmFilter: { base: string, head: string } | null,
 *   dryRunJson: boolean
 * }}
 */
function normalizeNxCiOptions(options = []) {
  const state = createNxCiState();

  for (let i = 0; i < options.length; i += 1) {
    const opt = options[i];

    // Try each handler in order; if one consumes it, continue
    const handlers = [
      handleDryRunJsonOption,
      handleTurboLogFlags,
      handleNxBaseHeadOption,
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

  // Promote explicit --base/--head into scmFilter (explicit flags override filter-derived values).
  if (state.base || state.head) {
    state.scmFilter = {
      base: state.base || state.scmFilter?.base || 'main',
      head: state.head || state.scmFilter?.head || 'HEAD',
    };
  }

  const { normalizedOptions, hasAll, hasProjectsFlag, scmFilter, dryRunJson } = state;

  return { normalizedOptions, hasAll, hasProjectsFlag, scmFilter, dryRunJson };
}

/**
 * `nx show projects` accepts fewer flags than `nx affected` / `nx run-many`.
 * Keep only safe ones here.
 *
 * @param {string[]} normalizedOptions
 * @returns {string[]}
 */
function filterOptionsForNxShowProjects(normalizedOptions) {
  return normalizedOptions.filter((option) => {
    return (
      option === '--all' ||
      option === '--affected' ||
      option.startsWith('--projects') || // --projects / --projects=...
      option === '--exclude' ||
      option.startsWith('--exclude=') ||
      option === '--type' ||
      option.startsWith('--type=')
    );
  });
}

/**
 * Build Nx-specific CI args from normalized options.
 *
 * Behavior:
 * - if `--dry-run=json` / `--dry=json`: emit `nx show projects ... --json` (planning)
 * - if SCM range detected (filter [base...head] or explicit --base/--head): emit `nx affected`
 * - else: emit `nx run-many`
 *
 * @param {"build"|"test"} task
 * @param {string[]} options
 * @returns {string[]}
 */
export function buildNxCiArgs(task, options = []) {
  const { normalizedOptions, hasAll, hasProjectsFlag, scmFilter, dryRunJson } =
    normalizeNxCiOptions(options);

  // Turbo dry-run=json equivalent for Nx: list matching projects as JSON.
  if (dryRunJson) {
    const safe = filterOptionsForNxShowProjects(normalizedOptions);

    const args = ['show', 'projects', ...safe, '--json', `--with-target=${task}`];

    if (scmFilter) {
      const base = scmFilter.base || 'main';
      const head = scmFilter.head || 'HEAD';
      args.push('--affected', `--base=${base}`, `--head=${head}`);
    } else if (!hasAll && !hasProjectsFlag) {
      // Keep symmetry with your run-many behavior
      args.push('--all');
    }

    return args;
  }

  // SCM mode → nx affected (base/head are only meaningful here)
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

  // Default mode → nx run-many
  const args = ['run-many', `--target=${task}`, ...normalizedOptions];

  if (!hasAll && !hasProjectsFlag) {
    args.push('--all');
  }

  return args;
}

/**
 * Check whether the provided runner represents Nx.
 * Accepts: "nx", "/usr/bin/nx", "C:\\tools\\nx.cmd"
 *
 * @param {string} runner
 * @returns {boolean}
 */
export function isNxRunner(runner) {
  if (typeof runner !== 'string') return false;

  const trimmed = runner.trim();
  if (!trimmed) return false;

  const baseName = path.basename(trimmed).toLowerCase();
  return baseName === 'nx' || baseName === 'nx.cmd' || baseName === 'nx.exe';
}
