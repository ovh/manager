#!/usr/bin/env node
/**
 * manager-legacy-lint
 * ------------------
 * Per-project legacy lint runner meant to be executed from *any* folder:
 * - Run from an app/module folder OR from repo root → same behavior.
 * - Scopes file discovery to the *current working directory* (projectRoot),
 *   while executing tools from the repository root (repoRoot) for stable config resolution.
 *
 * Design goals
 * ------------
 * 1) Incremental by app/module (Turbo/Nx can run & cache per project)
 * 2) Centralized tooling + configs at repo root
 * 3) Deterministic ESLint behavior:
 *    - By default, force the *root* ESLint config even if the app has its own .eslintrc.*
 *    - Allow overrides via --config if needed.
 * 4) Deterministic plugin/config resolution:
 *    - Force ESLint to resolve plugins from THIS package (legacy-kit),
 *      not from repo root (avoids version mismatch like prettier plugin v4+ with ESLint v6).
 * 5) Allow local *deltas* safely:
 *    - We still ignore local .eslintrc.*, but we *merge local globals* automatically
 *      (common need for legacy apps defining build-time globals like __VERSION__).
 * 6) Never lint dependencies:
 *    - markdown/stylelint are fed with an explicit file list (not globs),
 *      excluding node_modules and other ignored folders to avoid remark “ignored file” errors.
 *
 * Usage
 * -----
 * manager-legacy-lint --kinds tsx,js,css,html,md
 *   [--fix]
 *   [--continue]
 *   [--non-blocking-html]
 *   [--config path/to/.eslintrc]          (ESLint config override)
 */
import { globSync } from 'glob';
import { spawn } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);

/* ────────────────────────────────────────────────────────────── */
/* Args parsing                                                    */
/* ────────────────────────────────────────────────────────────── */

function parseArgs(argv) {
  const hasFlag = (flag) => argv.includes(flag);
  const getFlagValue = (flag) => {
    const i = argv.indexOf(flag);
    return i >= 0 ? argv[i + 1] : undefined;
  };

  const fix = hasFlag('--fix');
  const shouldContinue = hasFlag('--continue');
  const nonBlockingHtml = hasFlag('--non-blocking-html');
  const debug = hasFlag('--debug');

  const kindsRaw = getFlagValue('--kinds') ?? 'all';
  const kinds =
    kindsRaw === 'all'
      ? ['tsx', 'js', 'css', 'html', 'md']
      : kindsRaw
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);

  // ESLint-only override (deliberate: other tools keep their default behavior)
  const eslintConfigOverride = getFlagValue('--config');

  return { fix, shouldContinue, nonBlockingHtml, kinds, eslintConfigOverride, debug };
}

const args = parseArgs(process.argv.slice(2));

/* ────────────────────────────────────────────────────────────── */
/* Runtime paths                                                   */
/* ────────────────────────────────────────────────────────────── */

const THIS_FILE = fileURLToPath(import.meta.url);
const BIN_DIR = path.dirname(THIS_FILE);
const LEGACY_KIT_ROOT = path.resolve(BIN_DIR, '..');

/* ────────────────────────────────────────────────────────────── */
/* Repo discovery                                                  */
/* ────────────────────────────────────────────────────────────── */

function findUp(startDir, fileOrDirName) {
  let dir = startDir;
  while (true) {
    const candidate = path.join(dir, fileOrDirName);
    if (existsSync(candidate)) return candidate;
    const parent = path.dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

function findRepoRoot(startDir) {
  const markers = [
    'turbo.json',
    'nx.json',
    'yarn.lock',
    'pnpm-lock.yaml',
    'package-lock.json',
    '.git',
    'package.json',
  ];

  for (const marker of markers) {
    const hit = findUp(startDir, marker);
    if (hit) return path.dirname(hit);
  }

  return startDir;
}

function posixify(p) {
  return p.split(path.sep).join('/');
}

const projectRoot = process.cwd();
const repoRoot = findRepoRoot(projectRoot);

const relRaw = path.relative(repoRoot, projectRoot);
const projectRelFromRepo = relRaw ? posixify(relRaw) : '.';

const cacheKey = projectRelFromRepo === '.' ? 'repo-root' : projectRelFromRepo.replace(/\//g, '__');

/* ────────────────────────────────────────────────────────────── */
/* Logging helper                                                  */
/* ────────────────────────────────────────────────────────────── */

/**
 * Small helper to log resolved configuration paths per tool.
 * This makes it easy to debug why a given lint behavior happens.
 */
function logConfig(kind, entries) {
  if (!args.debug) return;

  console.log(`\n[manager-legacy-lint] ${kind} config resolution:`);
  for (const [label, value] of Object.entries(entries)) {
    console.log(`  - ${label}: ${value ?? '(none)'}`);
  }
}

/* ────────────────────────────────────────────────────────────── */
/* JSON helpers                                                    */
/* ────────────────────────────────────────────────────────────── */

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, 'utf8'));
}

function pickFirstExisting(directory, candidates) {
  for (const candidateFile of candidates) {
    const filePath = path.join(directory, candidateFile);
    if (existsSync(filePath)) return filePath;
  }
  return null;
}

/* ────────────────────────────────────────────────────────────── */
/* Package/bin resolution (avoid .bin shims)                       */
/* ────────────────────────────────────────────────────────────── */

function resolveBinFromPackageJson(pkgJsonRequest, preferredBinName) {
  const pkgJsonPath = require.resolve(pkgJsonRequest);
  const pkgRoot = path.dirname(pkgJsonPath);
  const pkg = readJson(pkgJsonPath);

  const bin = pkg.bin;
  if (!bin) {
    throw new Error(`[manager-legacy-lint] No "bin" field in ${pkg.name}`);
  }

  const relBinPath =
    typeof bin === 'string' ? bin : (bin[preferredBinName] ?? Object.values(bin)[0]);

  if (!relBinPath) {
    throw new Error(
      `[manager-legacy-lint] Could not resolve bin "${preferredBinName}" in ${pkg.name}`,
    );
  }

  return path.join(pkgRoot, relBinPath);
}

const ESLINT_CLI = resolveBinFromPackageJson('eslint/package.json', 'eslint');
const STYLELINT_CLI = resolveBinFromPackageJson('stylelint/package.json', 'stylelint');
const REMARK_CLI = resolveBinFromPackageJson('remark-cli/package.json', 'remark');
const HTMLHINT_CLI = resolveBinFromPackageJson('htmlhint/package.json', 'htmlhint');

/* ────────────────────────────────────────────────────────────── */
/* Root config discovery                                            */
/* ────────────────────────────────────────────────────────────── */

function resolveEslintConfigPath({ overrideValue }) {
  if (overrideValue) {
    return path.isAbsolute(overrideValue)
      ? overrideValue
      : path.resolve(projectRoot, overrideValue);
  }

  const rootEslintConfig = pickFirstExisting(repoRoot, [
    '.eslintrc.js',
    '.eslintrc.cjs',
    '.eslintrc.json',
    '.eslintrc.yaml',
    '.eslintrc.yml',
  ]);

  if (!rootEslintConfig) {
    throw new Error(`[manager-legacy-lint] No root ESLint config found in ${repoRoot}`);
  }

  return rootEslintConfig;
}

const ROOT_ESLINT_CONFIG = resolveEslintConfigPath({
  overrideValue: args.eslintConfigOverride,
});
const ROOT_ESLINT_IGNORE = pickFirstExisting(repoRoot, ['.eslintignore']);

/**
 * Other tools (stylelint/remark/htmlhint) do not receive explicit configs.
 * They will use their own config resolution logic from `cwd`.
 * Since we run them from `repoRoot`, they will typically pick configs from repoRoot.
 */
const ROOT_STYLELINT_CONFIG = pickFirstExisting(repoRoot, [
  '.stylelintrc',
  '.stylelintrc.json',
  '.stylelintrc.yaml',
  '.stylelintrc.yml',
  '.stylelintrc.js',
  '.stylelintrc.cjs',
  'stylelint.config.js',
  'stylelint.config.cjs',
]);

const ROOT_REMARK_CONFIG = pickFirstExisting(repoRoot, [
  '.remarkrc',
  '.remarkrc.json',
  '.remarkrc.yaml',
  '.remarkrc.yml',
  '.remarkrc.js',
  '.remarkrc.cjs',
]);

const ROOT_REMARK_IGNORE = pickFirstExisting(repoRoot, ['.remarkignore']);

const ROOT_HTMLHINT_CONFIG = pickFirstExisting(repoRoot, ['.htmlhintrc', '.htmlhintrc.json']);

const PRETTIER_CLI = resolveBinFromPackageJson('prettier/package.json', 'prettier');

const ROOT_PRETTIER_CONFIG = pickFirstExisting(repoRoot, [
  '.prettierrc',
  '.prettierrc.json',
  '.prettierrc.yaml',
  '.prettierrc.yml',
  '.prettierrc.js',
  '.prettierrc.cjs',
  'prettier.config.js',
  'prettier.config.cjs',
]);

const ROOT_PRETTIER_IGNORE = pickFirstExisting(repoRoot, ['.prettierignore']);

/* ────────────────────────────────────────────────────────────── */
/* Local ESLint deltas (globals only)                               */
/* ────────────────────────────────────────────────────────────── */

function readLocalGlobalsFlags(projectDir) {
  const localRcPath = pickFirstExisting(projectDir, ['.eslintrc.json', '.eslintrc']);
  if (!localRcPath) return [];

  try {
    const localRc = readJson(localRcPath);
    const globals = localRc?.globals;
    if (!globals || typeof globals !== 'object') return [];

    const flags = [];
    for (const [name, value] of Object.entries(globals)) {
      // ESLint accepts: readonly | writable | off
      let normalized;
      if (value === true) normalized = 'writable';
      else if (value === false) normalized = 'off';
      else if (typeof value === 'string') normalized = value;
      else normalized = 'writable';

      flags.push('--global', `${name}:${normalized}`);
    }
    return flags;
  } catch {
    return [];
  }
}

const LOCAL_GLOBAL_FLAGS = readLocalGlobalsFlags(projectRoot);

/* ────────────────────────────────────────────────────────────── */
/* Globs & ignore policy                                            */
/* ────────────────────────────────────────────────────────────── */
const IGNORE_DIRS = [
  '**/dist/**',
  '**/coverage/**',
  '**/www/**',
  '**/screenshot/**',
  '**/docs-api/**',
  '**/node_modules/**',

  // Exclude documentation files everywhere
  '**/README.md',
  '**/CONTRIBUTING.md',
  '**/readme.md',
  '**/contributing.md',
];

/**
 * Note:
 * - We *scope* patterns to the project folder (projectRelFromRepo)
 * - We run tools from repoRoot for consistent root config discovery.
 */
function patternsForKind(kind) {
  switch (kind) {
    case 'tsx':
      return [`${projectRelFromRepo}/**/*.{ts,tsx}`];
    case 'js':
      return [`${projectRelFromRepo}/**/*.js`];
    case 'css':
      return [`${projectRelFromRepo}/**/*.{css,less,scss}`];
    case 'html':
      return [`${projectRelFromRepo}/**/*.html`];
    case 'md':
      return [`${projectRelFromRepo}/**/*.md`];
    default:
      return [];
  }
}

/**
 * Explicit file listing helper (used for tools that behave poorly with globs + ignores).
 * This prevents passing ignored files to the tool (remark can error on ignored inputs).
 */
function listFiles(patterns, extraIgnores = []) {
  const ignore = [...IGNORE_DIRS, ...extraIgnores];
  return patterns.flatMap((p) =>
    globSync(p, {
      cwd: repoRoot,
      ignore,
      nodir: true,
      dot: false,
    }),
  );
}

function hasAnyMatch(patterns, extraIgnores = []) {
  return listFiles(patterns, extraIgnores).length > 0;
}

/* ────────────────────────────────────────────────────────────── */
/* Process execution                                                */
/* ────────────────────────────────────────────────────────────── */

function runNodeCli(cliPath, cliArgs, { cwd = repoRoot } = {}) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [cliPath, ...cliArgs], {
      cwd,
      stdio: 'inherit',
      shell: false,
    });

    child.on('close', (code) => resolve(code ?? 1));
    child.on('error', () => resolve(1));
  });
}

/* ────────────────────────────────────────────────────────────── */
/* Prettier                                                          */
/* ────────────────────────────────────────────────────────────── */

async function runPrettier(kind) {
  if (!args.fix) return 0;

  // Only run where it matters (tsx/js);
  if (kind !== 'tsx' && kind !== 'js') return 0;

  const patterns = patternsForKind(kind);
  const files = listFiles(patterns); // uses IGNORE_DIRS already
  if (files.length === 0) return 0;

  logConfig(`Prettier (${kind})`, {
    projectRoot,
    repoRoot,
    'config (--config)': ROOT_PRETTIER_CONFIG,
    'ignore (--ignore-path)': ROOT_PRETTIER_IGNORE,
    'cwd (tool runs from)': repoRoot,
  });

  const BATCH_SIZE = 200;
  let ok = true;

  for (let i = 0; i < files.length; i += BATCH_SIZE) {
    const batch = files.slice(i, i + BATCH_SIZE);
    const cliArgs = [
      '--write',
      ...(ROOT_PRETTIER_CONFIG ? ['--config', ROOT_PRETTIER_CONFIG] : []),
      ...(ROOT_PRETTIER_IGNORE ? ['--ignore-path', ROOT_PRETTIER_IGNORE] : []),
      ...batch,
    ];
    const code = await runNodeCli(PRETTIER_CLI, cliArgs);
    if (code !== 0) ok = false;
  }

  return ok ? 0 : 1;
}

/* ────────────────────────────────────────────────────────────── */
/* ESLint                                                          */
/* ────────────────────────────────────────────────────────────── */

function buildEslintArgs(filePatterns) {
  const cacheLocation = path.join(repoRoot, 'node_modules/.cache/eslint-legacy', cacheKey);

  return [
    '--quiet',
    '--cache',
    '--cache-location',
    cacheLocation,
    ...(args.fix ? ['--fix'] : []),

    // Deterministic baseline
    '--no-eslintrc',
    '--config',
    ROOT_ESLINT_CONFIG,
    ...(ROOT_ESLINT_IGNORE ? ['--ignore-path', ROOT_ESLINT_IGNORE] : []),

    // Resolve configs/plugins from legacy-kit deps (avoid hoisting mismatches)
    '--resolve-plugins-relative-to',
    LEGACY_KIT_ROOT,

    // Safe local delta
    ...LOCAL_GLOBAL_FLAGS,

    // Extra safety ignores
    ...IGNORE_DIRS.flatMap((p) => ['--ignore-pattern', p]),

    ...filePatterns,
  ];
}

async function runEslint(kind) {
  const patterns = patternsForKind(kind);
  if (!hasAnyMatch(patterns)) return 0;

  logConfig(`ESLint (${kind})`, {
    projectRoot,
    repoRoot,
    'config (--config)': ROOT_ESLINT_CONFIG,
    'ignore (--ignore-path)': ROOT_ESLINT_IGNORE,
    'override (--config flag)': args.eslintConfigOverride ?? '(none)',
    'resolve-plugins-relative-to': LEGACY_KIT_ROOT,
    'local globals merged': LOCAL_GLOBAL_FLAGS.length
      ? `${LOCAL_GLOBAL_FLAGS.length / 2} globals`
      : '(none)',
  });

  // Format first (when --fix), then ESLint fix everything else.
  const prettierCode = await runPrettier(kind);
  if (prettierCode !== 0) return prettierCode;

  // ESLint accepts globs; ignore-patterns handle node_modules/dist/etc.
  return runNodeCli(ESLINT_CLI, buildEslintArgs(patterns));
}

/* ────────────────────────────────────────────────────────────── */
/* Stylelint (explicit files, exclude node_modules)                 */
/* ────────────────────────────────────────────────────────────── */

async function runStylelint() {
  const patterns = patternsForKind('css');
  const files = listFiles(patterns);
  if (files.length === 0) return 0;

  logConfig('Stylelint', {
    projectRoot,
    repoRoot,
    'config (auto)': ROOT_STYLELINT_CONFIG,
    'cwd (tool runs from)': repoRoot,
  });

  // Batch to avoid E2BIG on very large apps
  const BATCH_SIZE = 200;
  let ok = true;

  for (let i = 0; i < files.length; i += BATCH_SIZE) {
    const batch = files.slice(i, i + BATCH_SIZE);
    const cliArgs = [...(args.fix ? ['--fix'] : []), '--allow-empty-input', ...batch];
    const code = await runNodeCli(STYLELINT_CLI, cliArgs);
    if (code !== 0) ok = false;
  }

  return ok ? 0 : 1;
}

/* ────────────────────────────────────────────────────────────── */
/* Remark (explicit files, exclude node_modules + changelogs)       */
/* ────────────────────────────────────────────────────────────── */

async function runRemark() {
  const patterns = patternsForKind('md');

  /**
   * Many repos ignore CHANGELOG.md globally via .remarkignore.
   * Passing ignored files to remark can produce: "Cannot process specified file: it’s ignored".
   * We prevent that by excluding changelogs from inputs.
   */
  const files = listFiles(patterns, ['**/CHANGELOG.md']);
  if (files.length === 0) return 0;

  logConfig('Remark', {
    projectRoot,
    repoRoot,
    'config (auto)': ROOT_REMARK_CONFIG,
    'ignore (auto)': ROOT_REMARK_IGNORE,
    'cwd (tool runs from)': repoRoot,
  });

  // Batch to avoid E2BIG on large apps
  const BATCH_SIZE = 200;
  let ok = true;

  for (let i = 0; i < files.length; i += BATCH_SIZE) {
    const batch = files.slice(i, i + BATCH_SIZE);

    // Keep same semantics as root: -qf (quiet + frail)
    const cliArgs = ['-qf', ...batch];
    const code = await runNodeCli(REMARK_CLI, cliArgs);
    if (code !== 0) ok = false;
  }

  return ok ? 0 : 1;
}

/* ────────────────────────────────────────────────────────────── */
/* HTMLHint (explicit files, exclude node_modules)                  */
/* ────────────────────────────────────────────────────────────── */

async function runHtmlhint() {
  const patterns = patternsForKind('html');
  const files = listFiles(patterns);
  if (files.length === 0) return 0;

  logConfig('HTMLHint', {
    projectRoot,
    repoRoot,
    'config (auto)': ROOT_HTMLHINT_CONFIG,
    'cwd (tool runs from)': repoRoot,
  });

  const BATCH_SIZE = 100;
  let ok = true;

  for (let i = 0; i < files.length; i += BATCH_SIZE) {
    const batch = files.slice(i, i + BATCH_SIZE);
    const code = await runNodeCli(HTMLHINT_CLI, batch);
    if (code !== 0) ok = false;
  }

  if (!ok && args.nonBlockingHtml) return 0;
  return ok ? 0 : 1;
}

/* ────────────────────────────────────────────────────────────── */
/* Orchestration                                                    */
/* ────────────────────────────────────────────────────────────── */

const RUNNERS = {
  tsx: () => runEslint('tsx'),
  js: () => runEslint('js'),
  css: runStylelint,
  md: runRemark,
  html: runHtmlhint,
};

async function runAll() {
  const failures = [];

  for (const kind of args.kinds) {
    const runner = RUNNERS[kind];
    if (!runner) continue;

    const exitCode = await runner();
    if (exitCode !== 0) {
      failures.push({ kind, exitCode });
      if (!args.shouldContinue) break;
    }
  }

  return failures;
}

const failures = await runAll();
process.exit(failures.length ? 1 : 0);
