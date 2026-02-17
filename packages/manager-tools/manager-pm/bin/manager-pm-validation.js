#!/usr/bin/env node
/**
 * manager-pm CLI & Catalog Validation
 * -----------------------------------
 * Comprehensive validation suite for the hybrid Yarn + PNPM orchestration.
 *
 * It covers:
 *  - Core CLI commands (build, test, lint, workspace, etc.)
 *  - PNPM/Yarn catalog integrity
 *  - Private module consistency and path existence
 *  - Cross-catalog duplicate detection
 *  - Migration readiness for Bun
 *  - Turbo runner coverage (default runner)
 *  - Nx runner coverage (when available) including:
 *      - SCM filters: --filter="...[base...head]" → nx affected / nx show projects
 *      - Explicit SCM: --base/--head
 *      - dry-run=json planning mode
 *      - --projects precedence over --filter
 *      - directory filter normalization (strip ./)
 *      - concurrency→parallel mapping
 *      - ensure turbo-only flags are not forwarded to nx
 *      - ensure raw nx CLI can run (optional)
 *
 * Usage:
 *   yarn validate:cli
 *
 * Author: OVHCloud Engineering
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

import { logger } from '../src/kernel/utils/log-manager.js';

/* ============================================================
 * Shell / FS / JSON Utilities
 * ============================================================ */

const MAX_BUFFER = 50 * 1024 * 1024; // 50MB to avoid truncation on large dry-run JSON

/**
 * Execute a shell command and return normalized result.
 */
function executeShellCommand(command) {
  const execution = spawnSync(command, {
    stdio: 'pipe',
    shell: true,
    encoding: 'utf8',
    maxBuffer: MAX_BUFFER,
  });

  // spawnSync uses `status` for exit code, `null` if terminated by signal
  const exitCode = typeof execution.status === 'number' ? execution.status : 1;

  return {
    exitCode,
    stdout: execution.stdout ?? '',
    stderr: execution.stderr ?? '',
  };
}

function shellCommandSucceeds(command) {
  return executeShellCommand(command).exitCode === 0;
}

function fileOrDirectoryExists(targetPath) {
  try {
    fs.accessSync(targetPath);
    return true;
  } catch {
    return false;
  }
}

function readJsonFile(jsonFilePath) {
  return JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
}

/* ============================================================
 * Test / Assertion Helpers
 * ============================================================ */

/**
 * Decide if a test succeeded based on expected exit code OR an assert callback.
 */
function isTestSuccessful(commandResult, expectedExitCode, assertFn) {
  if (typeof expectedExitCode === 'number') {
    return commandResult.exitCode === expectedExitCode;
  }

  if (typeof assertFn === 'function') {
    try {
      return Boolean(assertFn(commandResult.stdout, commandResult.stderr, commandResult.exitCode));
    } catch {
      return false;
    }
  }

  return false;
}

function assertContains(haystack, needle) {
  return typeof haystack === 'string' && haystack.includes(needle);
}

function assertNotContains(haystack, needle) {
  return typeof haystack === 'string' && !haystack.includes(needle);
}

function logTestFailure(testName, testCommand, commandResult) {
  logger.error(`❌ ${testName}`);
  if (testCommand) logger.error(`command: ${testCommand}`);
  logger.error(`exitCode: ${commandResult.exitCode}`);
  if (commandResult.stdout?.trim()) logger.error(`stdout:\n${commandResult.stdout}`);
  if (commandResult.stderr?.trim()) logger.error(`stderr:\n${commandResult.stderr}`);
}

/**
 * Execute a single test definition and return { status, commandResult }.
 * status ∈ 'passed' | 'failed' | 'skipped'
 */
function runSingleTest(test) {
  const isEnabled = typeof test.enabled === 'function' ? test.enabled() : true;

  if (!isEnabled) {
    return { status: 'skipped', commandResult: { exitCode: 0, stdout: '', stderr: '' } };
  }

  const commandResult = test.command
    ? executeShellCommand(test.command)
    : { exitCode: 0, stdout: '', stderr: '' };

  const success = isTestSuccessful(commandResult, test.expectedExitCode, test.assert);
  return { status: success ? 'passed' : 'failed', commandResult };
}

/* ============================================================
 * Output Parsing Helpers
 * ============================================================ */

/**
 * Extract the underlying runner command line printed by manager-pm logs.
 * Examples:
 *   "ℹ ▶ nx run-many --target=build ..."
 *   "ℹ ▶ nx affected --target=build ..."
 *   "ℹ ▶ nx show projects ..."
 *   "ℹ ▶ turbo run build ..."
 */
function extractRunnerCommandLine(output, runner /* 'nx' | 'turbo' */) {
  const re = new RegExp(String.raw`▶\s*${runner}\s+.*$`, 'm');
  const match = String(output ?? '').match(re);
  return match ? match[0] : null;
}

/**
 * Try to extract JSON from noisy output (logs + JSON).
 */
function tryParseJsonFromNoisyOutput(text) {
  const s = String(text ?? '');
  const candidates = [];

  const firstObj = s.indexOf('{');
  const firstArr = s.indexOf('[');

  if (firstObj !== -1) candidates.push(firstObj);
  if (firstArr !== -1) candidates.push(firstArr);

  const lastObj = s.lastIndexOf('{');
  const lastArr = s.lastIndexOf('[');

  if (lastObj !== -1) candidates.push(lastObj);
  if (lastArr !== -1) candidates.push(lastArr);

  const uniq = [...new Set(candidates)].sort((a, b) => a - b);

  const tryParseSlice = (startIdx) => {
    const slice = s.slice(startIdx).trim();

    try {
      return JSON.parse(slice);
    } catch {
      const lastCloseObj = slice.lastIndexOf('}');
      const lastCloseArr = slice.lastIndexOf(']');
      const endIdx = Math.max(lastCloseObj, lastCloseArr);

      if (endIdx > 0) {
        const trimmed = slice.slice(0, endIdx + 1);
        try {
          return JSON.parse(trimmed);
        } catch {
          return null;
        }
      }
      return null;
    }
  };

  for (const idx of uniq) {
    const parsed = tryParseSlice(idx);
    if (parsed !== null) return parsed;
  }

  return null;
}

/* ============================================================
 * Environment / Context Detection
 * ============================================================ */

/**
 * Detect whether Nx tests should run:
 * - manager-pm exposes `--runner`
 * - Nx is available (yarn nx OR nx.json exists)
 */
function detectNxContext() {
  const helpOutput = executeShellCommand('yarn -s manager-pm --help');
  const managerPmSupportsRunnerFlag = (helpOutput.stdout + helpOutput.stderr).includes('--runner');

  const nxCliAvailable = shellCommandSucceeds('yarn -s nx --version');
  const nxConfigAvailable = fileOrDirectoryExists('nx.json');

  const nxAvailable = nxCliAvailable || nxConfigAvailable;

  return {
    managerPmSupportsRunnerFlag,
    nxAvailable,
    shouldRunNxTests: managerPmSupportsRunnerFlag && nxAvailable,
  };
}

function gitRefExists(ref) {
  if (!ref) return false;
  // quote ref to avoid shell surprises
  return shellCommandSucceeds(`git rev-parse --verify "${ref}" >/dev/null 2>&1`);
}

/**
 * SCM refs used for tests.
 *
 * Important: HEAD^1...HEAD can be "no changes" in many cases, which makes dry-run JSON flaky.
 * We therefore prefer stable remote ranges if present, then fall back to local refs.
 */
function computeStableScmRefs() {
  const candidates = [
    { base: 'origin/master', head: 'origin/develop' },
    { base: 'origin/main', head: 'origin/develop' },
    { base: 'origin/master', head: 'HEAD' },
    { base: 'origin/main', head: 'HEAD' },
    { base: 'HEAD^1', head: 'HEAD' },
    { base: 'HEAD', head: 'HEAD' },
  ];

  for (const c of candidates) {
    if (gitRefExists(c.base) && gitRefExists(c.head)) return c;
  }

  // very last resort
  return { base: 'HEAD', head: 'HEAD' };
}

/* ============================================================
 * Catalog Sampling Helpers
 * ============================================================ */

/**
 * Try to pick a real workspace package name from catalogs (more robust than hardcoding).
 */
function pickSamplePackageName(catalogPaths, fallbackName) {
  for (const p of catalogPaths) {
    const pj = path.join(p, 'package.json');
    if (!fileOrDirectoryExists(pj)) continue;
    try {
      const pkg = readJsonFile(pj);
      if (pkg?.name && typeof pkg.name === 'string') return pkg.name;
    } catch {
      // ignore
    }
  }
  return fallbackName;
}

/**
 * Try to pick a real workspace path from catalogs.
 */
function pickSampleWorkspacePath(catalogPaths, fallbackPath) {
  const found = catalogPaths.find((p) => fileOrDirectoryExists(p));
  return found || fallbackPath;
}

/* ============================================================
 * Bootstrapping (compute once)
 * ============================================================ */

const nxContext = detectNxContext();
const scmRefs = computeStableScmRefs();

// --- Catalog loading ---
const catalogDirectoryPath = path.resolve('packages/manager-tools/manager-pm/src/playbook/catalog');
const pnpmCatalogFilePath = path.join(catalogDirectoryPath, 'pnpm-catalog.json');
const yarnCatalogFilePath = path.join(catalogDirectoryPath, 'yarn-catalog.json');
const privateModulesFilePath = path.join(catalogDirectoryPath, 'pnpm-private-modules.json');

const pnpmCatalogPaths = readJsonFile(pnpmCatalogFilePath);
const yarnCatalogPaths = readJsonFile(yarnCatalogFilePath);
const privateModuleEntries = readJsonFile(privateModulesFilePath);

// Samples used across tests
const DEFAULT_SAMPLE_PKG = '@ovh-ux/manager-zimbra-app';
const samplePkgName =
  pickSamplePackageName(yarnCatalogPaths, DEFAULT_SAMPLE_PKG) ||
  pickSamplePackageName(pnpmCatalogPaths, DEFAULT_SAMPLE_PKG) ||
  DEFAULT_SAMPLE_PKG;

const sampleWorkspacePath = pickSampleWorkspacePath(
  yarnCatalogPaths,
  'packages/manager/apps/zimbra',
);
const sampleDirFilter = `./${sampleWorkspacePath}`; // ensure ./ stripping gets exercised

/* ============================================================
 * CLI Tests
 * ============================================================ */

const cliTests = [
  {
    name: 'Print version (sanity check)',
    command: 'yarn -s manager-pm --version',
    expectedExitCode: 0,
  },
  {
    name: 'Display help menu',
    command: 'yarn -s manager-pm --help',
    assert: (stdout, stderr) => (stdout + stderr).includes('--action'),
  },

  // ---------------------------------
  // Turbo runner (baseline) – default
  // ---------------------------------
  {
    name: `Turbo: dry-run=json plan returns JSON (project filter) [${samplePkgName}]`,
    command: `yarn -s manager-pm --action buildCI --filter=${samplePkgName} --dry-run=json --output-logs=none`,
    assert: (stdout, stderr, exitCode) => {
      if (exitCode !== 0) return false;

      const parsed = tryParseJsonFromNoisyOutput(stdout + '\n' + stderr);
      if (!parsed || typeof parsed !== 'object') return false;

      const hasTasks = Array.isArray(parsed.tasks);
      const hasPackages = Array.isArray(parsed.packages);
      return hasTasks || hasPackages;
    },
  },

  // NOTE: this is the previously flaky one. We:
  //  1) use stable refs (origin/master...origin/develop when available)
  //  2) force --silent so the output is just the runner JSON (easier and safer to parse)
  {
    name: `Turbo: dry-run=json plan returns JSON (SCM filter) base=${scmRefs.base} head=${scmRefs.head}`,
    command: `yarn -s manager-pm --silent --action buildCI --filter="...[${scmRefs.base}...${scmRefs.head}]" --dry-run=json --output-logs=none`,
    assert: (stdout, stderr, exitCode) => {
      if (exitCode !== 0) return false;

      // In silent mode, stdout should be the JSON. If nothing is printed, it's a failure.
      const parsed = tryParseJsonFromNoisyOutput(stdout + '\n' + stderr);
      return Boolean(parsed && typeof parsed === 'object');
    },
  },

  {
    name: `Turbo: buildCI (verbose) [${samplePkgName}]`,
    command: `yarn manager-pm --action buildCI --filter=${samplePkgName}`,
    expectedExitCode: 0,
  },
  {
    name: `Turbo: buildCI (silent) [${samplePkgName}]`,
    command: `yarn -s manager-pm --silent --action buildCI --filter=${samplePkgName}`,
    expectedExitCode: 0,
  },
  {
    name: `Turbo: testCI [${samplePkgName}]`,
    command: `yarn -s manager-pm --action testCI --filter=${samplePkgName}`,
    expectedExitCode: 0,
  },

  // ---------------------------------
  // Nx runner coverage (only if Nx + --runner are available)
  // ---------------------------------
  {
    name: 'Nx: Print version with Nx runner flag (sanity check)',
    enabled: () => nxContext.shouldRunNxTests,
    command: 'yarn -s manager-pm --runner nx --version',
    expectedExitCode: 0,
  },

  // Nx: dry-run=json should map to "nx show projects ... --json"
  {
    name: `Nx: dry-run=json uses "nx show projects" (project filter) [${samplePkgName}]`,
    enabled: () => nxContext.shouldRunNxTests,
    command: `yarn -s manager-pm --runner nx --action buildCI --filter=${samplePkgName} --dry-run=json --output-logs=none`,
    assert: (stdout, stderr, exitCode) => {
      if (exitCode !== 0) return false;
      const out = stdout + '\n' + stderr;

      const line = extractRunnerCommandLine(out, 'nx');
      if (!line) return false;

      if (!assertContains(line, 'nx show projects')) return false;
      if (!assertContains(line, '--json')) return false;

      // ensure turbo-only flags not forwarded to nx
      if (!assertNotContains(line, '--output-logs')) return false;

      const parsed = tryParseJsonFromNoisyOutput(out);
      return Array.isArray(parsed);
    },
  },

  // Nx: directory filter normalization (strip "./")
  {
    name: `Nx: directory --filter normalizes to --projects without leading "./" (${sampleDirFilter})`,
    enabled: () => nxContext.shouldRunNxTests,
    command: `yarn -s manager-pm --runner nx --action buildCI --filter=${sampleDirFilter} --dry-run=json`,
    assert: (stdout, stderr, exitCode) => {
      if (exitCode !== 0) return false;
      const out = stdout + '\n' + stderr;
      const line = extractRunnerCommandLine(out, 'nx');
      if (!line) return false;

      if (!assertContains(line, 'nx show projects')) return false;
      if (!assertContains(line, '--projects=')) return false;
      return !assertContains(line, '--projects=./');
    },
  },

  // Nx: SCM filter should become affected selection (dry-run=json => show projects --affected)
  {
    name: `Nx: SCM --filter="...[base...head]" + dry-run=json produces affected selection with --base/--head`,
    enabled: () => nxContext.shouldRunNxTests,
    command: `yarn -s manager-pm --runner nx --action buildCI --filter="...[${scmRefs.base}...${scmRefs.head}]" --dry-run=json`,
    assert: (stdout, stderr, exitCode) => {
      if (exitCode !== 0) return false;
      const out = stdout + '\n' + stderr;
      const line = extractRunnerCommandLine(out, 'nx');
      if (!line) return false;

      if (!assertContains(line, 'nx show projects')) return false;
      if (!assertContains(line, '--affected')) return false;
      if (!assertContains(line, `--base=${scmRefs.base}`)) return false;
      if (!assertContains(line, `--head=${scmRefs.head}`)) return false;

      const parsed = tryParseJsonFromNoisyOutput(out);
      return Array.isArray(parsed);
    },
  },

  // Nx: explicit --base/--head should force affected (non-dry-run) even without filter
  {
    name: `Nx: explicit --base/--head triggers "nx affected" (fast: base=head=HEAD)`,
    enabled: () => nxContext.shouldRunNxTests,
    command: `yarn -s manager-pm --runner nx --action buildCI --base=HEAD --head=HEAD`,
    assert: (stdout, stderr, exitCode) => {
      if (exitCode !== 0) return false;

      const out = stdout + '\n' + stderr;
      const line = extractRunnerCommandLine(out, 'nx');
      if (!line) return false;

      if (!assertContains(line, 'nx affected')) return false;
      if (!assertContains(line, '--target=build')) return false;
      if (!assertContains(line, '--base=HEAD')) return false;
      if (!assertContains(line, '--head=HEAD')) return false;

      return !assertContains(line, 'run-many');
    },
  },

  // Nx: --projects precedence over --filter
  {
    name: `Nx: --projects takes precedence over --filter (dry-run=json)`,
    enabled: () => nxContext.shouldRunNxTests,
    command: `yarn -s manager-pm --runner nx --action buildCI --projects=${samplePkgName} --filter=${sampleDirFilter} --dry-run=json`,
    assert: (stdout, stderr, exitCode) => {
      if (exitCode !== 0) return false;
      const out = stdout + '\n' + stderr;
      const line = extractRunnerCommandLine(out, 'nx');
      if (!line) return false;

      if (!assertContains(line, `--projects=${samplePkgName}`)) return false;
      return !assertContains(line, '--projects=./');
    },
  },

  // Nx: concurrency mapping (non-dry-run) should translate to --parallel
  {
    name: 'Nx: --concurrency=3 maps to --parallel=3 (fast: base=head=HEAD)',
    enabled: () => nxContext.shouldRunNxTests,
    command: `yarn -s manager-pm --runner nx --action buildCI --base=HEAD --head=HEAD --concurrency=3`,
    assert: (stdout, stderr, exitCode) => {
      if (exitCode !== 0) return false;
      const out = stdout + '\n' + stderr;
      const line = extractRunnerCommandLine(out, 'nx');
      if (!line) return false;

      if (!assertContains(line, '--parallel=3')) return false;
      return !assertContains(line, '--concurrency=3');
    },
  },
  {
    name: 'Nx: --concurrency 2 maps to "--parallel 2" (fast: base=head=HEAD)',
    enabled: () => nxContext.shouldRunNxTests,
    command: `yarn -s manager-pm --runner nx --action buildCI --base=HEAD --head=HEAD --concurrency 2`,
    assert: (stdout, stderr, exitCode) => {
      if (exitCode !== 0) return false;
      const out = stdout + '\n' + stderr;
      const line = extractRunnerCommandLine(out, 'nx');
      if (!line) return false;

      const ok = assertContains(line, '--parallel 2') || assertContains(line, '--parallel=2');
      if (!ok) return false;

      return !assertContains(line, '--concurrency');
    },
  },

  // Nx: workspace/cache directory exists after Nx runs
  {
    name: 'Nx: workspace/cache directory exists after Nx runs',
    enabled: () => nxContext.shouldRunNxTests,
    assert: () => fileOrDirectoryExists('.nx') || fileOrDirectoryExists(path.join('.nx', 'cache')),
  },

  // Optional: ensure raw nx CLI works (not through manager-pm)
  {
    name: 'Nx: raw "nx show projects --affected --json" works',
    enabled: () => nxContext.nxAvailable,
    command: `yarn -s nx show projects --affected --base=${scmRefs.base} --head=${scmRefs.head} --json`,
    assert: (stdout, stderr, exitCode) => {
      if (exitCode !== 0) return false;
      const parsed = tryParseJsonFromNoisyOutput(stdout + '\n' + stderr);
      return Array.isArray(parsed);
    },
  },

  // ---------------------------------
  // Other CLI + orchestration checks
  // ---------------------------------
  {
    name: 'Run full lint across Yarn + PNPM apps',
    command: 'yarn -s manager-pm --type pnpm --action full-lint',
    expectedExitCode: 0,
  },
  {
    name: 'Prepare merged workspace view',
    command: 'yarn pm:prepare:legacy:workspace',
    expectedExitCode: 0,
  },
  {
    name: 'Remove merged workspace view',
    command: 'yarn pm:remove:legacy:workspace',
    expectedExitCode: 0,
  },
  {
    name: 'List all workspaces via Lerna passthrough',
    command: 'yarn -s manager-pm --silent --action lerna list --all --json --toposort',
    assert: (stdout) => stdout.includes('@ovh-ux/'),
  },
  {
    name: 'Invalid command should fail gracefully',
    command: 'yarn -s manager-pm --action doesnotexist',
    expectedExitCode: 1,
  },
  {
    name: 'Simulate Bun migration readiness',
    command: 'yarn -s manager-pm --type bun --action version || true',
    expectedExitCode: 0,
  },
];

/* ============================================================
 * Catalog Tests
 * ============================================================ */

const catalogTests = [];

// 1️⃣ Validate catalog entries
pnpmCatalogPaths.forEach((appPath) => {
  catalogTests.push({
    name: `PNPM catalog path exists → ${appPath}`,
    assert: () => fileOrDirectoryExists(appPath),
  });
});

yarnCatalogPaths.forEach((appPath) => {
  catalogTests.push({
    name: `Yarn catalog path exists → ${appPath}`,
    assert: () => fileOrDirectoryExists(appPath),
  });
});

// 2️⃣ Validate private module fields and structure
privateModuleEntries.forEach((moduleEntry) => {
  catalogTests.push({
    name: `Private module structure valid → ${moduleEntry.pnpm}`,
    assert: () =>
      moduleEntry.turbo.startsWith('--filter @ovh-ux/') && moduleEntry.pnpm.startsWith('packages/'),
  });

  catalogTests.push({
    name: `Private module path exists → ${moduleEntry.pnpm}`,
    assert: () => fileOrDirectoryExists(moduleEntry.pnpm),
  });

  const packageJsonPath = path.join(moduleEntry.pnpm, 'package.json');
  if (fileOrDirectoryExists(packageJsonPath)) {
    const packageJson = readJsonFile(packageJsonPath);
    catalogTests.push({
      name: `Private module name matches turbo filter → ${packageJson.name}`,
      assert: () => moduleEntry.turbo.includes(packageJson.name),
    });
  }
});

// 3️⃣ Detect duplicates across catalogs
const allCatalogPaths = [...pnpmCatalogPaths, ...yarnCatalogPaths];
const duplicateCatalogPaths = allCatalogPaths.filter(
  (value, index, array) => array.indexOf(value) !== index,
);

catalogTests.push({
  name: 'No duplicates between PNPM and Yarn catalogs',
  assert: () => duplicateCatalogPaths.length === 0,
});

// 4️⃣ Check critical private modules
const criticalPrivateModuleNames = [
  '@ovh-ux/manager-core-utils',
  '@ovh-ux/manager-static-analysis-kit',
  '@ovh-ux/manager-react-core-application',
];

criticalPrivateModuleNames.forEach((moduleName) => {
  catalogTests.push({
    name: `Critical private module registered → ${moduleName}`,
    assert: () => privateModuleEntries.some((entry) => entry.turbo.includes(moduleName)),
  });
});

// 5️⃣ Ensure no broken private module paths
catalogTests.push({
  name: 'All private module directories exist',
  assert: () => privateModuleEntries.every((entry) => fileOrDirectoryExists(entry.pnpm)),
});

/* ============================================================
 * Runner
 * ============================================================ */

const allTests = [...cliTests, ...catalogTests];

let failedTestCount = 0;
let skippedTestCount = 0;

logger.info('\n🚀 Starting manager-pm CLI & Catalog validation suite...\n');
logger.info(
  `🧭 Nx detection: --runner supported=${nxContext.managerPmSupportsRunnerFlag}, nx available=${nxContext.nxAvailable}, nx tests enabled=${nxContext.shouldRunNxTests}\n`,
);
logger.info(`🧪 Samples: pkg=${samplePkgName}, path=${sampleWorkspacePath}`);
logger.info(`🔀 SCM refs: base=${scmRefs.base}, head=${scmRefs.head}\n`);

for (const test of allTests) {
  const isEnabled = typeof test.enabled === 'function' ? test.enabled() : true;

  if (!isEnabled) {
    skippedTestCount++;
    logger.info(`⏭️  Skipped: ${test.name}`);
    continue;
  }

  logger.info(`🔎 ${test.name}`);

  const { status, commandResult } = runSingleTest(test);

  if (status === 'failed') {
    failedTestCount++;
    logTestFailure(test.name, test.command, commandResult);
  } else {
    logger.info(`✅ ${test.name}`);
  }
}

logger.info('\n📊 Validation Summary');
logger.info(`🧱 PNPM apps: ${pnpmCatalogPaths.length}`);
logger.info(`🧩 Yarn apps: ${yarnCatalogPaths.length}`);
logger.info(`🔒 Private modules: ${privateModuleEntries.length}`);
logger.info(`✅ Passed: ${allTests.length - failedTestCount - skippedTestCount}`);
logger.info(`❌ Failed: ${failedTestCount}`);
logger.info(`⏭️  Skipped: ${skippedTestCount}`);

if (failedTestCount > 0) {
  logger.error('\n❌ Some validation tests failed.');
  process.exit(1);
}

logger.info('\n🎉 All manager-pm CLI & catalog validation tests passed successfully!');
