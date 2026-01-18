#!/usr/bin/env node
/**
 * manager-legacy-lint
 * ------------------
 * Per-project legacy lint runner meant to be executed from *any* folder:
 * - Run from an app/module folder OR from repo root → same behavior.
 * - Scopes file globs to the *current working directory* (projectRoot),
 *   while executing tools from the repository root (repoRoot) for stable config resolution.
 *
 * Design goals
 * ------------
 * 1) Incremental by app/module (Turbo/Nx can run & cache per project)
 * 2) Centralized tooling + configs at repo root
 * 3) Deterministic ESLint behavior:
 *    - By default, force the *root* ESLint config even if the app has its own .eslintrc.*
 *    - Allow overrides via --config if needed.
 *
 * Usage
 * -----
 * manager-legacy-lint --kinds tsx,js,css,html,md [--fix] [--continue] [--non-blocking-html] [--config path/to/.eslintrc]
 */
import { glob } from 'glob';
import { spawn } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import process from 'node:process';

const require = createRequire(import.meta.url);

/* ────────────────────────────────────────────────────────────── */
/* Args parsing                                                   */
/* ────────────────────────────────────────────────────────────── */

function parseArgs(argv) {
  const hasFlag = (f) => argv.includes(f);
  const getFlagValue = (f) => {
    const i = argv.indexOf(f);
    return i >= 0 ? argv[i + 1] : undefined;
  };

  const fix = hasFlag('--fix');
  const shouldContinue = hasFlag('--continue');
  const nonBlockingHtml = hasFlag('--non-blocking-html');

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

  return { fix, shouldContinue, nonBlockingHtml, kinds, eslintConfigOverride };
}

const args = parseArgs(process.argv.slice(2));

/* ────────────────────────────────────────────────────────────── */
/* Repo discovery                                                 */
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
  // Strong markers first (works for Turbo/Nx/Yarn/PNPM + git repos)
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

  // Fallback: treat current directory as repo root
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
/* Package/bin resolution (avoid .bin shims)                       */
/* ────────────────────────────────────────────────────────────── */

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, 'utf8'));
}

/**
 * Resolve a package's executable by reading its package.json "bin" field.
 * This is more stable across platforms than relying on node_modules/.bin.
 */
function resolveBinFromPackageJson(pkgJsonRequest, preferredBinName) {
  const pkgJsonPath = require.resolve(pkgJsonRequest);
  const pkgRoot = path.dirname(pkgJsonPath);
  const pkg = readJson(pkgJsonPath);

  const bin = pkg.bin;
  if (!bin) {
    throw new Error(`[manager-legacy-lint] No "bin" field in ${pkg.name}`);
  }

  let relBinPath;

  if (typeof bin === 'string') {
    // Single-bin package
    relBinPath = bin;
  } else {
    // Multi-bin package: pick preferred name if present, else first entry
    relBinPath = bin[preferredBinName] ?? Object.values(bin)[0];
  }

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
/* Config discovery                                                */
/* ────────────────────────────────────────────────────────────── */

function pickFirstExisting(dir, candidates) {
  for (const f of candidates) {
    const p = path.join(dir, f);
    if (existsSync(p)) return p;
  }
  return null;
}

function resolveEslintConfigPath({ overrideValue }) {
  if (overrideValue) {
    // Allow relative override from where the command is executed (projectRoot)
    return path.isAbsolute(overrideValue)
      ? overrideValue
      : path.resolve(projectRoot, overrideValue);
  }

  // Default: root config (deterministic baseline)
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

/* ────────────────────────────────────────────────────────────── */
/* Globs & ignores                                                 */
/* ────────────────────────────────────────────────────────────── */

const IGNORE_DIRS = [
  '**/dist/**',
  '**/coverage/**',
  '**/www/**',
  '**/screenshot/**',
  '**/docs-api/**',
  '**/node_modules/**',
];

/**
 * Patterns are built relative to repoRoot (because we execute tools from repoRoot).
 * They are scoped to the "current project" via projectRelFromRepo.
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
 * Lightweight existence check to avoid running tools with empty globs
 * in projects that don't contain a certain file type.
 */
function hasAnyMatch(patterns) {
  for (const p of patterns) {
    const matches = glob.sync(p, { cwd: repoRoot, ignore: IGNORE_DIRS, nodir: true });
    if (matches.length > 0) return true;
  }
  return false;
}

/* ────────────────────────────────────────────────────────────── */
/* Process execution                                                */
/* ────────────────────────────────────────────────────────────── */

function runNodeCli(cliPath, cliArgs) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [cliPath, ...cliArgs], {
      cwd: repoRoot,
      stdio: 'inherit',
      shell: false,
    });

    child.on('close', (code) => resolve(code ?? 1));
    child.on('error', () => resolve(1));
  });
}

/* ────────────────────────────────────────────────────────────── */
/* Tool runners                                                     */
/* ────────────────────────────────────────────────────────────── */

function buildEslintArgs(filePatterns) {
  const cacheLocation = path.join(repoRoot, 'node_modules/.cache/eslint-legacy', cacheKey);

  return [
    '--quiet',
    '--cache',
    '--cache-location',
    cacheLocation,
    ...(args.fix ? ['--fix'] : []),

    /**
     * Deterministic: ignore app-local .eslintrc.* by default.
     * If you want local behavior, pass --config path/to/.eslintrc.*
     * (we still keep --no-eslintrc to make the chosen config explicit).
     */
    '--no-eslintrc',
    '--config',
    ROOT_ESLINT_CONFIG,
    ...(ROOT_ESLINT_IGNORE ? ['--ignore-path', ROOT_ESLINT_IGNORE] : []),

    // Extra safety ignores
    ...IGNORE_DIRS.flatMap((p) => ['--ignore-pattern', p]),

    ...filePatterns,
  ];
}

async function runEslint(kind) {
  const patterns = patternsForKind(kind);
  if (!hasAnyMatch(patterns)) return 0;

  return runNodeCli(ESLINT_CLI, buildEslintArgs(patterns));
}

async function runStylelint() {
  const patterns = patternsForKind('css');
  if (!hasAnyMatch(patterns)) return 0;

  const cliArgs = [...(args.fix ? ['--fix'] : []), ...patterns, '--allow-empty-input'];
  return runNodeCli(STYLELINT_CLI, cliArgs);
}

async function runRemark() {
  const patterns = patternsForKind('md');
  if (!hasAnyMatch(patterns)) return 0;

  // remark-cli supports -qf and accepts globs
  const cliArgs = ['-qf', ...patterns];
  return runNodeCli(REMARK_CLI, cliArgs);
}

async function runHtmlhint() {
  const pattern = patternsForKind('html')[0];
  if (!pattern) return 0;

  const files = glob.sync(pattern, {
    cwd: repoRoot,
    ignore: IGNORE_DIRS,
    nodir: true,
  });

  if (files.length === 0) return 0;

  // Batch to avoid E2BIG (too many args)
  const BATCH_SIZE = 100;
  let ok = true;

  for (let i = 0; i < files.length; i += BATCH_SIZE) {
    const batch = files.slice(i, i + BATCH_SIZE);
    const code = await runNodeCli(HTMLHINT_CLI, batch);
    if (code !== 0) ok = false;
  }

  // Keep your "non-blocking in CI" behavior if desired
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
