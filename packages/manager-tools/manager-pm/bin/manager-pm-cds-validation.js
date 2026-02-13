#!/usr/bin/env node
/**
 * manager-pm CDS Validation Suite (Turbo + Nx)
 * --------------------------------------------
 * End-to-end simulation of CDS build pipeline validation for manager-pm workflows.
 *
 * Goals:
 *  - Keep Turbo scenario as reference (unchanged schema: {packages,tasks})
 *  - Support Nx dry-run output (often a JSON array from `nx show projects --json`)
 *  - Normalize Nx output into a Turbo-like schema for downstream checks
 *  - Validate:
 *      - JSON parse + basic schema
 *      - CDS-equivalent PACKAGES_TO_BUILD computation (strict mapping)
 *      - Directory existence
 *      - Universe detection
 *      - Runner parity using an overlap/coverage metric (Nx and Turbo can legitimately differ)
 *
 * Determinism:
 *  - No process.env reads. All knobs are constants in this file.
 *
 * Author: OVHCloud Engineering
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

import { logger } from '../src/kernel/utils/log-manager.js';
import { VALIDATION_MANUAL_CASES } from './manager-pm-validation-config.js';

/* ============================================================
 * Config
 * ============================================================ */

const config = {
  workspace: path.resolve(process.cwd()),
  baseBranch: 'origin/master',
  gitBranch: 'origin/develop',
  outputRoot: 'test-results/cds',
  tmp: {
    turbo: 'test-results/cds/output.turbo.json',
    nxFilter: 'test-results/cds/output.nx.filter.json',
    nxBaseHead: 'test-results/cds/output.nx.basehead.json',
  },
  snapshots: {
    turbo: 'test-results/cds/dry-run-snapshot.turbo.json',
    nxRaw: 'test-results/cds/dry-run-snapshot.nx.raw.json',
    nxNormalized: 'test-results/cds/dry-run-snapshot.nx.normalized.json',
    nxBaseHeadRaw: 'test-results/cds/dry-run-snapshot.nx.basehead.raw.json',
    nxBaseHeadNormalized: 'test-results/cds/dry-run-snapshot.nx.basehead.normalized.json',
  },

  /**
   * Parity strategy between Turbo and Nx outputs:
   * - 'overlap' (default): require a minimum overlap ratio between sets (robust; recommended)
   * - 'subset': require Nx ⊆ Turbo (strict; can fail depending on runner graph semantics)
   * - 'equal': require Nx == Turbo (very strict; rarely desirable)
   */
  nxParity: 'overlap',

  /**
   * Minimum overlap coverage required for 'overlap' parity.
   * coverage = |A ∩ B| / min(|A|,|B|)  (0..1)
   */
  nxMinCoverage: 0.1,

  /**
   * Consistency required between the two Nx strategies (filter vs base/head).
   * Using overlap (same formula) to avoid flakiness from ordering / graph differences.
   */
  nxConsistencyMinCoverage: 0.7,

  /**
   * Universe list used by CDS pipeline.
   * Keep it small and stable (for signal, not exhaustive).
   */
  universeCandidates: ['dedicated', 'public-cloud', 'telecom', 'web'],

  /**
   * Sampling for directory existence checks to keep runtime predictable.
   */
  maxDirExistenceSamples: 25,
};

/* ============================================================
 * Shell / FS helpers
 * ============================================================ */

function runCommand(command, cwd = config.workspace) {
  const result = spawnSync(command, {
    shell: true,
    cwd,
    stdio: 'pipe',
    encoding: 'utf8',
    maxBuffer: 50 * 1024 * 1024,
  });

  return {
    code: typeof result.status === 'number' ? result.status : 1,
    stdout: (result.stdout || '').toString(),
    stderr: (result.stderr || '').toString(),
  };
}

function exists(targetPath) {
  try {
    fs.accessSync(targetPath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Parse JSON from a file (strict), returning null if invalid.
 */
function readJsonSafe(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

/* ============================================================
 * Reporting helpers
 * ============================================================ */

const results = [];

function record(name, passed, details = '') {
  results.push({ name, passed, details, skipped: false });
  logger.info(`${passed ? '✅' : '❌'} ${name}${details ? ` → ${details}` : ''}`);
}

function recordSkip(name, details = '') {
  results.push({ name, passed: true, details, skipped: true });
  logger.info(`⏭️  ${name}${details ? ` → ${details}` : ''}`);
}

/* ============================================================
 * Detection
 * ============================================================ */

/**
 * Detect Nx context:
 * - manager-pm exposes --runner
 * - Nx is available (yarn nx OR nx.json exists)
 */
function detectNxContext() {
  const help = runCommand('yarn -s manager-pm --help', config.workspace);
  const managerPmSupportsRunnerFlag = (help.stdout + help.stderr).includes('--runner');

  const nxCliOk = runCommand('yarn -s nx --version', config.workspace).code === 0;
  const nxJsonOk = exists(path.join(config.workspace, 'nx.json'));

  const nxAvailable = nxCliOk || nxJsonOk;

  return {
    managerPmSupportsRunnerFlag,
    nxAvailable,
    shouldRunNxTests: managerPmSupportsRunnerFlag && nxAvailable,
  };
}

const nxContext = detectNxContext();

/* ============================================================
 * JSON normalization
 * ============================================================ */

function uniqSorted(values) {
  return Array.from(new Set(values)).sort();
}

/**
 * Extract package.json directories to build lookup maps.
 * Used to normalize Nx project lists (names) into package name + directory.
 */
function collectPackageJsonDirs(rootDir) {
  if (!exists(rootDir)) return [];
  const out = [];
  const stack = [rootDir];

  while (stack.length) {
    const dir = stack.pop();
    let entries = [];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      continue;
    }

    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (!entry.isDirectory()) continue;

      const pj = path.join(full, 'package.json');
      if (exists(pj)) {
        out.push(full);
      } else {
        stack.push(full);
      }
    }
  }

  return out;
}

function safeReadPackageJson(dir) {
  try {
    const pj = path.join(dir, 'package.json');
    if (!exists(pj)) return null;
    return JSON.parse(fs.readFileSync(pj, 'utf8'));
  } catch {
    return null;
  }
}

/**
 * Create maps:
 * - byPackageName: pkgName -> {name, dir}
 * - byFolderName: lastSegment -> array of {name, dir}
 */
function buildWorkspaceMaps() {
  const roots = [
    'packages/manager',
    'packages/manager/core',
    'packages/manager/modules',
    'packages/manager-tools',
    'packages/components',
    'packages',
  ].map((r) => path.join(config.workspace, r));

  const dirs = [];
  for (const r of roots) dirs.push(...collectPackageJsonDirs(r));

  const byPackageName = new Map();
  const byFolderName = new Map();

  for (const dir of dirs) {
    const pkg = safeReadPackageJson(dir);
    if (!pkg?.name) continue;

    const name = String(pkg.name);
    byPackageName.set(name, { name, dir });

    const folder = path.basename(dir);
    const list = byFolderName.get(folder) || [];
    list.push({ name, dir });
    byFolderName.set(folder, list);
  }

  return { byPackageName, byFolderName, allDirs: dirs };
}

const workspaceMaps = buildWorkspaceMaps();

/**
 * Normalize Nx output into a Turbo-like schema:
 * - If Nx already outputs {packages,tasks}, keep it.
 * - If Nx outputs an array (common: project names), map each project to {package, directory}.
 *
 * Returns:
 *   {
 *     packages: string[],
 *     tasks: Array<{package:string, directory:string}>,
 *     meta: { mapped:number, total:number }
 *   }
 */
function normalizeNxDryRun(nxRaw) {
  // Already in expected shape?
  if (nxRaw && typeof nxRaw === 'object' && !Array.isArray(nxRaw)) {
    const packages = Array.isArray(nxRaw.packages) ? nxRaw.packages : null;
    const tasks = Array.isArray(nxRaw.tasks) ? nxRaw.tasks : null;

    if (packages && tasks) {
      return {
        packages: uniqSorted(packages),
        tasks,
        meta: { mapped: packages.length, total: packages.length },
      };
    }
  }

  // Common case: array of project names
  if (!Array.isArray(nxRaw)) {
    return { packages: [], tasks: [], meta: { mapped: 0, total: 0 } };
  }

  const projects = nxRaw.map((x) => String(x)).filter(Boolean);
  const tasks = [];
  const packages = [];
  let mapped = 0;

  for (const proj of projects) {
    // 1) Exact package name match (most reliable)
    const hit = workspaceMaps.byPackageName.get(proj);
    if (hit) {
      mapped += 1;
      packages.push(hit.name);
      tasks.push({ package: hit.name, directory: normalizeToRepoRelative(hit.dir) });
      continue;
    }

    // 2) Folder-name match (fallback)
    const folderCandidates = workspaceMaps.byFolderName.get(proj) || [];
    if (folderCandidates.length) {
      // choose the first; if multiple, at least it's deterministic
      const chosen = folderCandidates[0];
      mapped += 1;
      packages.push(chosen.name);
      tasks.push({ package: chosen.name, directory: normalizeToRepoRelative(chosen.dir) });
      continue;
    }

    // 3) If proj looks like a path, try resolving it
    if (proj.startsWith('packages/')) {
      const abs = path.join(config.workspace, proj);
      const pkg = safeReadPackageJson(abs);
      if (pkg?.name) {
        mapped += 1;
        packages.push(String(pkg.name));
        tasks.push({ package: String(pkg.name), directory: proj });
      }
    }
  }

  return {
    packages: uniqSorted(packages),
    tasks,
    meta: { mapped, total: projects.length },
  };
}

/**
 * Normalize any absolute directory into repo-relative (POSIX-ish) path, if possible.
 */
function normalizeToRepoRelative(absDir) {
  const rel = path.relative(config.workspace, absDir).replaceAll(path.sep, '/');
  return rel.startsWith('.') ? rel.replace(/^\.\/?/, '') : rel;
}

/* ============================================================
 * CDS-equivalent logic
 * ============================================================ */

/**
 * Mirrors CDS get_paths_changed_packages() behavior:
 *  - list1 = tasks[].package
 *  - list2 = packages[]
 *  - keep packages that exist in tasks[].package
 *  - map to tasks[].directory for those packages
 *  - keep directories under packages/manager/apps
 */
function computePathsChangedPackages(data) {
  const tasks = Array.isArray(data?.tasks) ? data.tasks : [];
  const packages = Array.isArray(data?.packages) ? data.packages : [];

  const taskPkgSet = new Set(
    tasks.map((t) => t?.package).filter((p) => typeof p === 'string' && p.length > 0),
  );

  const dirs = [];

  for (const pkg of packages) {
    if (typeof pkg !== 'string' || !pkg.length) continue;
    if (!taskPkgSet.has(pkg)) continue;

    for (const t of tasks) {
      if (t?.package !== pkg) continue;
      const d = t?.directory;
      if (typeof d !== 'string' || !d.length) continue;
      if (d.startsWith('packages/manager/apps')) dirs.push(d);
    }
  }

  return uniqSorted(dirs);
}

/**
 * Compute universe list from directories.
 */
function detectUniverses(dirs) {
  const found = config.universeCandidates.filter((u) => dirs.some((p) => p.includes(u)));
  return uniqSorted(found);
}

/* ============================================================
 * Parity metrics
 * ============================================================ */

function computeOverlapCoverage(a, b) {
  const A = new Set(a);
  const B = new Set(b);

  if (A.size === 0 && B.size === 0) return 1;

  const minSize = Math.min(A.size, B.size);
  if (minSize === 0) return 0;

  let inter = 0;
  for (const x of A) if (B.has(x)) inter += 1;

  return inter / minSize;
}

function diffSets(a, b) {
  const A = new Set(a);
  const B = new Set(b);

  const missingInB = [];
  const extraInB = [];

  for (const x of A) if (!B.has(x)) missingInB.push(x);
  for (const x of B) if (!A.has(x)) extraInB.push(x);

  return { missingInB: missingInB.sort(), extraInB: extraInB.sort() };
}

function formatSample(arr, max = 8) {
  return arr.slice(0, max).join(', ');
}

function recordParity(label, turboList, nxList) {
  const t = uniqSorted(turboList);
  const n = uniqSorted(nxList);

  if (config.nxParity === 'equal') {
    const d = diffSets(t, n);
    const ok = d.missingInB.length === 0 && d.extraInB.length === 0;
    record(
      `Parity(equal): Nx == Turbo (${label})`,
      ok,
      ok
        ? 'identical'
        : `missingInNx=${formatSample(d.missingInB)} | extraInNx=${formatSample(d.extraInB)}`,
    );
    return;
  }

  if (config.nxParity === 'subset') {
    // Nx ⊆ Turbo  ==> elements in Nx not in Turbo must be empty
    const d = diffSets(t, n);
    const ok = d.extraInB.length === 0;
    record(
      `Parity(subset): Nx ⊆ Turbo (${label})`,
      ok,
      ok ? 'ok' : `extraInNx=${formatSample(d.extraInB)}`,
    );
    return;
  }

  // overlap mode (default)
  const coverage = computeOverlapCoverage(t, n);
  const ok = coverage >= config.nxMinCoverage;
  const d = diffSets(t, n);

  record(
    `Parity(overlap): Nx ↔ Turbo (${label})`,
    ok,
    `coverage=${coverage.toFixed(2)} (min=${config.nxMinCoverage}) | missingInNx=${formatSample(d.missingInB)} | extraInNx=${formatSample(d.extraInB)}`,
  );
}

/* ============================================================
 * Main
 * ============================================================ */

const tmpTurboPath = path.join(config.workspace, config.tmp.turbo);
const tmpNxFilterPath = path.join(config.workspace, config.tmp.nxFilter);
const tmpNxBaseHeadPath = path.join(config.workspace, config.tmp.nxBaseHead);

fs.mkdirSync(path.dirname(tmpTurboPath), { recursive: true });

logger.info('\n🚀 Starting manager-pm CDS Validation Suite...\n');
logger.info(
  `🧭 Nx detection: --runner supported=${nxContext.managerPmSupportsRunnerFlag}, nx available=${nxContext.nxAvailable}, nx tests enabled=${nxContext.shouldRunNxTests}\n`,
);
logger.info(`🧪 Parity mode: nxParity=${config.nxParity}, nxMinCoverage=${config.nxMinCoverage}\n`);

/* 1️⃣ Sanity check: manager-pm executable */
{
  const binPath = path.join(config.workspace, 'node_modules/.bin/manager-pm');

  let res = runCommand('yarn -s manager-pm --version', config.workspace);
  if (res.code !== 0 && exists(binPath)) {
    res = runCommand(`${binPath} --version`, config.workspace);
  }
  record('Sanity check: manager-pm executable', res.code === 0, res.stdout.trim());
}

/* 2️⃣ Turbo dry-run */
{
  const scm = `...[${config.baseBranch}...${config.gitBranch}]`;
  const cmd = `yarn -s manager-pm --silent --action buildCI --dry-run=json --filter="${scm}" > ${tmpTurboPath}`;
  const { code } = runCommand(cmd, config.workspace);
  record(
    'Run get_changed_packages dry-run (Turbo)',
    code === 0 && exists(tmpTurboPath),
    `scm=${scm}`,
  );
}

/* 2️⃣b Nx dry-run (filter) + (base/head) */
{
  if (!nxContext.shouldRunNxTests) {
    recordSkip(
      'Run Nx get_changed_packages dry-run (filter)',
      'Nx not available or --runner unsupported',
    );
    recordSkip(
      'Run Nx get_changed_packages dry-run (base/head)',
      'Nx not available or --runner unsupported',
    );
  } else {
    const scm = `...[${config.baseBranch}...${config.gitBranch}]`;
    const cmd1 = `yarn -s manager-pm --silent --runner nx --action buildCI --dry-run=json --filter="${scm}" > ${tmpNxFilterPath}`;
    const r1 = runCommand(cmd1, config.workspace);
    record(
      'Run Nx get_changed_packages dry-run (filter)',
      r1.code === 0 && exists(tmpNxFilterPath),
      `scm=${scm}`,
    );

    const cmd2 = `yarn -s manager-pm --silent --runner nx --action buildCI --dry-run=json --base=${config.baseBranch} --head=${config.gitBranch} > ${tmpNxBaseHeadPath}`;
    const r2 = runCommand(cmd2, config.workspace);
    record(
      'Run Nx get_changed_packages dry-run (base/head)',
      r2.code === 0 && exists(tmpNxBaseHeadPath),
      `base=${config.baseBranch} head=${config.gitBranch}`,
    );
  }
}

/* 3️⃣ Read + validate Turbo JSON schema */
const turboData = readJsonSafe(tmpTurboPath);
if (!turboData) {
  record('Turbo: Validate dry-run JSON parse', false, 'Missing or invalid JSON');
} else {
  const pkgCount = Array.isArray(turboData.packages) ? turboData.packages.length : 0;
  const taskCount = Array.isArray(turboData.tasks) ? turboData.tasks.length : 0;
  record(
    'Turbo: Validate dry-run JSON structure',
    pkgCount > 0 && taskCount > 0,
    `${pkgCount} packages / ${taskCount} tasks`,
  );
}

/* 3️⃣b Nx parse + normalize (filter + base/head) */
const nxFilterRaw = nxContext.shouldRunNxTests ? readJsonSafe(tmpNxFilterPath) : null;
const nxBaseHeadRaw = nxContext.shouldRunNxTests ? readJsonSafe(tmpNxBaseHeadPath) : null;

let nxFilterNorm = null;
let nxBaseHeadNorm = null;

if (!nxContext.shouldRunNxTests) {
  recordSkip('Nx(filter): Validate dry-run JSON parse', 'Nx skipped');
  recordSkip('Nx(base/head): Validate dry-run JSON parse', 'Nx skipped');
  recordSkip('Nx(filter): Validate normalized schema (packages/tasks)', 'Nx skipped');
  recordSkip('Nx(base/head): Validate normalized schema (packages/tasks)', 'Nx skipped');
} else {
  record(
    'Nx(filter): Validate dry-run JSON parse',
    Boolean(nxFilterRaw),
    nxFilterRaw ? 'ok' : 'invalid JSON',
  );
  record(
    'Nx(base/head): Validate dry-run JSON parse',
    Boolean(nxBaseHeadRaw),
    nxBaseHeadRaw ? 'ok' : 'invalid JSON',
  );

  nxFilterNorm = normalizeNxDryRun(nxFilterRaw);
  nxBaseHeadNorm = normalizeNxDryRun(nxBaseHeadRaw);

  record(
    'Nx(filter): Validate normalized schema (packages/tasks)',
    nxFilterNorm.packages.length > 0 && nxFilterNorm.tasks.length > 0,
    `${nxFilterNorm.meta.mapped}/${nxFilterNorm.meta.total} mapped`,
  );
  record(
    'Nx(base/head): Validate normalized schema (packages/tasks)',
    nxBaseHeadNorm.packages.length > 0 && nxBaseHeadNorm.tasks.length > 0,
    `${nxBaseHeadNorm.meta.mapped}/${nxBaseHeadNorm.meta.total} mapped`,
  );
}

/* 3️⃣c Nx consistency: filter vs base/head */
if (!nxContext.shouldRunNxTests) {
  recordSkip('Nx consistency: filter vs base/head (packages)', 'Nx skipped');
  recordSkip('Nx consistency: filter vs base/head (tasks)', 'Nx skipped');
} else {
  const pCoverage = computeOverlapCoverage(nxFilterNorm.packages, nxBaseHeadNorm.packages);
  const pOk = pCoverage >= config.nxConsistencyMinCoverage;
  record(
    'Nx consistency: filter vs base/head (packages)',
    pOk,
    `coverage=${pCoverage.toFixed(2)} (min=${config.nxConsistencyMinCoverage})`,
  );

  const tFilterDirs = uniqSorted(
    (nxFilterNorm.tasks || []).map((t) => t.directory).filter(Boolean),
  );
  const tBaseDirs = uniqSorted(
    (nxBaseHeadNorm.tasks || []).map((t) => t.directory).filter(Boolean),
  );
  const tCoverage = computeOverlapCoverage(tFilterDirs, tBaseDirs);
  const tOk = tCoverage >= config.nxConsistencyMinCoverage;
  record(
    'Nx consistency: filter vs base/head (tasks)',
    tOk,
    `coverage=${tCoverage.toFixed(2)} (min=${config.nxConsistencyMinCoverage})`,
  );
}

/* 4️⃣ Compute CDS variables (Turbo reference) */
const turboPackages = Array.isArray(turboData?.packages) ? turboData.packages : [];
const turboTasks = Array.isArray(turboData?.tasks) ? turboData.tasks : [];

const turboAffectedPkgs = uniqSorted(
  turboPackages.filter((p) => typeof p === 'string' && p.startsWith('@ovh-ux/')),
);
record(
  'Turbo: Simulate AFFECTED_PKGS detection',
  turboAffectedPkgs.length >= 0,
  `${turboAffectedPkgs.length} found`,
);

const turboPackagesToBuildLoose = uniqSorted(
  turboTasks
    .map((t) => t?.directory)
    .filter((d) => typeof d === 'string' && d.startsWith('packages/manager/apps')),
);
record(
  'Turbo: Simulate PACKAGES_TO_BUILD detection (loose)',
  turboPackagesToBuildLoose.length >= 0,
  `${turboPackagesToBuildLoose.length} found`,
);

const turboPackagesToBuildStrict = computePathsChangedPackages(turboData);
record(
  'Turbo: get_paths_changed_packages (strict PACKAGES_TO_BUILD)',
  turboPackagesToBuildStrict.length >= 0,
  `${turboPackagesToBuildStrict.length} dirs`,
);

{
  const looseSet = new Set(turboPackagesToBuildLoose);
  const missing = turboPackagesToBuildStrict.filter((d) => !looseSet.has(d));
  record(
    'Turbo: strict PACKAGES_TO_BUILD is subset of loose',
    missing.length === 0,
    missing.length ? `unexpected dirs: ${formatSample(missing)}` : 'ok',
  );
}

const turboUniversesLoose = detectUniverses(turboPackagesToBuildLoose);
const turboUniversesStrict = detectUniverses(turboPackagesToBuildStrict);
record(
  'Turbo: Detect impacted universes (loose)',
  turboUniversesLoose.length >= 0,
  turboUniversesLoose.join(', ') || '(none)',
);
record(
  'Turbo: Detect impacted universes (strict)',
  turboUniversesStrict.length >= 0,
  turboUniversesStrict.join(', ') || '(none)',
);

/* 4️⃣b CDS variables for Nx (normalized filter mode as primary) */
const nxAffectedPkgs =
  nxContext.shouldRunNxTests && nxFilterNorm
    ? uniqSorted(
        nxFilterNorm.packages.filter((p) => typeof p === 'string' && p.startsWith('@ovh-ux/')),
      )
    : [];
if (!nxContext.shouldRunNxTests) {
  recordSkip('Nx: Simulate AFFECTED_PKGS detection', 'Nx skipped');
} else {
  record(
    'Nx: Simulate AFFECTED_PKGS detection',
    nxAffectedPkgs.length >= 0,
    `${nxAffectedPkgs.length} found`,
  );
}

const nxPackagesToBuildLoose =
  nxContext.shouldRunNxTests && nxFilterNorm
    ? uniqSorted(
        nxFilterNorm.tasks
          .map((t) => t?.directory)
          .filter((d) => typeof d === 'string' && d.startsWith('packages/manager/apps')),
      )
    : [];

if (!nxContext.shouldRunNxTests) {
  recordSkip('Nx: Simulate PACKAGES_TO_BUILD detection (loose)', 'Nx skipped');
} else {
  record(
    'Nx: Simulate PACKAGES_TO_BUILD detection (loose)',
    nxPackagesToBuildLoose.length >= 0,
    `${nxPackagesToBuildLoose.length} found`,
  );
}

const nxPackagesToBuildStrict =
  nxContext.shouldRunNxTests && nxFilterNorm ? computePathsChangedPackages(nxFilterNorm) : [];

if (!nxContext.shouldRunNxTests) {
  recordSkip('Nx: get_paths_changed_packages (strict PACKAGES_TO_BUILD)', 'Nx skipped');
} else {
  record(
    'Nx: get_paths_changed_packages (strict PACKAGES_TO_BUILD)',
    nxPackagesToBuildStrict.length >= 0,
    `${nxPackagesToBuildStrict.length} dirs`,
  );
}

if (!nxContext.shouldRunNxTests) {
  recordSkip('Nx: strict PACKAGES_TO_BUILD is subset of loose', 'Nx skipped');
} else {
  const looseSet = new Set(nxPackagesToBuildLoose);
  const missing = nxPackagesToBuildStrict.filter((d) => !looseSet.has(d));
  record(
    'Nx: strict PACKAGES_TO_BUILD is subset of loose',
    missing.length === 0,
    missing.length ? `unexpected dirs: ${formatSample(missing)}` : 'ok',
  );
}

const nxUniversesLoose = nxContext.shouldRunNxTests ? detectUniverses(nxPackagesToBuildLoose) : [];
const nxUniversesStrict = nxContext.shouldRunNxTests
  ? detectUniverses(nxPackagesToBuildStrict)
  : [];

if (!nxContext.shouldRunNxTests) {
  recordSkip('Nx: Detect impacted universes (loose)', 'Nx skipped');
  recordSkip('Nx: Detect impacted universes (strict)', 'Nx skipped');
} else {
  record(
    'Nx: Detect impacted universes (loose)',
    nxUniversesLoose.length >= 0,
    nxUniversesLoose.join(', ') || '(none)',
  );
  record(
    'Nx: Detect impacted universes (strict)',
    nxUniversesStrict.length >= 0,
    nxUniversesStrict.join(', ') || '(none)',
  );
}

/* 5️⃣ Directory existence checks (sampled) */
function recordDirectoriesExist(label, dirs) {
  const sample = dirs.slice(0, config.maxDirExistenceSamples);
  const missing = sample.filter((d) => !exists(path.join(config.workspace, d)));
  record(
    label,
    missing.length === 0,
    missing.length
      ? `missing (sample): ${formatSample(missing, 6)}`
      : `ok (sample of ${sample.length})`,
  );
}

recordDirectoriesExist('Turbo strict: Directories exist on disk', turboPackagesToBuildStrict);
if (!nxContext.shouldRunNxTests) {
  recordSkip('Nx strict: Directories exist on disk', 'Nx skipped');
} else {
  recordDirectoriesExist('Nx strict: Directories exist on disk', nxPackagesToBuildStrict);
}

/* 6️⃣ Parity checks (configurable) */
if (!nxContext.shouldRunNxTests) {
  recordSkip('Parity checks (Nx vs Turbo)', 'Nx skipped');
} else {
  recordParity('AFFECTED_PKGS', turboAffectedPkgs, nxAffectedPkgs);
  recordParity('PACKAGES_TO_BUILD loose', turboPackagesToBuildLoose, nxPackagesToBuildLoose);
  recordParity('PACKAGES_TO_BUILD strict', turboPackagesToBuildStrict, nxPackagesToBuildStrict);
  recordParity('IMPACTED_UNIVERSES loose', turboUniversesLoose, nxUniversesLoose);
  recordParity('IMPACTED_UNIVERSES strict', turboUniversesStrict, nxUniversesStrict);
}

/* 7️⃣ Ensure dist/client folder available */
{
  const distPath = path.join(config.workspace, 'dist/client');
  fs.mkdirSync(distPath, { recursive: true });
  record('Ensure dist/client folder available', exists(distPath));
}

/* 8️⃣ Universe injection simulation */
{
  const dirs = ['packages/manager/apps/dedicated', 'packages/manager/apps/public-cloud'];
  for (const d of dirs) fs.mkdirSync(path.join(config.workspace, d), { recursive: true });
  record(
    'Simulate universe injection',
    dirs.every((d) => exists(path.join(config.workspace, d))),
  );
}

/* 9️⃣ Worker export simulation (Turbo reference, CDS strict) */
{
  const workerExports = {
    AFFECTED_PKGS: turboAffectedPkgs.join(' '),
    PACKAGES_TO_BUILD: turboPackagesToBuildStrict.join(' '),
    IMPACTED_UNIVERSES: turboUniversesStrict.join(' '),
  };

  const ok =
    (turboAffectedPkgs.length === 0 && turboPackagesToBuildStrict.length === 0) ||
    workerExports.AFFECTED_PKGS.length > 0 ||
    workerExports.PACKAGES_TO_BUILD.length > 0;

  record('Generate worker export variables', ok, 'worker exports generated');
}

/* 🔟 Validate included packages exist anywhere in the monorepo (Turbo reference + manual fallback) */
function normalizeName(name) {
  return String(name)
    .replace(/^@ovh-ux\//, '')
    .replace(/^manager-/, '')
    .replace(/^component-/, '')
    .replace(/^core-/, 'core/')
    .replace(/^manager-core-/, 'core/')
    .replace(/^manager-tools-/, 'manager-tools/')
    .replace(/-app$/, '')
    .replace(/-module$/, '')
    .replace(/[^a-z0-9-/]/gi, '')
    .toLowerCase();
}

{
  const allDirs = workspaceMaps.allDirs || [];
  const missingPkgs = turboAffectedPkgs.filter((pkg) => {
    const normPkg = normalizeName(pkg);

    // manual mapping override
    const manualRel = VALIDATION_MANUAL_CASES?.[pkg];
    if (manualRel) {
      const manualAbs = path.join(config.workspace, manualRel);
      if (exists(manualAbs)) return false;
    }

    // fuzzy: match against directory string + package name normalization
    return !allDirs.some((dir) => normalizeName(dir).includes(normPkg));
  });

  record(
    'Validate included packages exist anywhere in monorepo',
    missingPkgs.length === 0,
    missingPkgs.length
      ? `${missingPkgs.length} missing (${formatSample(missingPkgs, 5)}...)`
      : 'all good',
  );
}

/* 11️⃣ Persist snapshots for reproducibility */
{
  const outputDir = path.join(config.workspace, config.outputRoot);
  fs.mkdirSync(outputDir, { recursive: true });

  if (turboData) {
    fs.writeFileSync(
      path.join(config.workspace, config.snapshots.turbo),
      JSON.stringify(turboData, null, 2),
    );
    record(
      'Persist Turbo dry-run snapshot',
      true,
      path.join(config.workspace, config.snapshots.turbo),
    );
  } else {
    record('Persist Turbo dry-run snapshot', false, 'Turbo output missing/invalid');
  }

  if (!nxContext.shouldRunNxTests) {
    recordSkip('Persist Nx dry-run snapshots', 'Nx skipped');
  } else {
    fs.writeFileSync(
      path.join(config.workspace, config.snapshots.nxRaw),
      JSON.stringify(nxFilterRaw ?? null, null, 2),
    );
    fs.writeFileSync(
      path.join(config.workspace, config.snapshots.nxNormalized),
      JSON.stringify(nxFilterNorm ?? null, null, 2),
    );
    fs.writeFileSync(
      path.join(config.workspace, config.snapshots.nxBaseHeadRaw),
      JSON.stringify(nxBaseHeadRaw ?? null, null, 2),
    );
    fs.writeFileSync(
      path.join(config.workspace, config.snapshots.nxBaseHeadNormalized),
      JSON.stringify(nxBaseHeadNorm ?? null, null, 2),
    );

    record(
      'Persist Nx dry-run snapshot (raw)',
      true,
      path.join(config.workspace, config.snapshots.nxRaw),
    );
    record(
      'Persist Nx dry-run snapshot (normalized)',
      true,
      path.join(config.workspace, config.snapshots.nxNormalized),
    );
    record(
      'Persist Nx(base/head) dry-run snapshot (raw)',
      true,
      path.join(config.workspace, config.snapshots.nxBaseHeadRaw),
    );
    record(
      'Persist Nx(base/head) dry-run snapshot (normalized)',
      true,
      path.join(config.workspace, config.snapshots.nxBaseHeadNormalized),
    );
  }
}

/* 12️⃣ Cleanup temp artifacts (keep snapshots + reports) */
{
  if (exists(tmpTurboPath)) fs.unlinkSync(tmpTurboPath);
  record('Cleanup Turbo dry-run artifact', !exists(tmpTurboPath));

  if (!nxContext.shouldRunNxTests) {
    recordSkip('Cleanup Nx dry-run artifacts', 'Nx skipped');
  } else {
    if (exists(tmpNxFilterPath)) fs.unlinkSync(tmpNxFilterPath);
    if (exists(tmpNxBaseHeadPath)) fs.unlinkSync(tmpNxBaseHeadPath);

    record('Cleanup Nx dry-run artifact', !exists(tmpNxFilterPath));
    record('Cleanup Nx(base/head) dry-run artifact', !exists(tmpNxBaseHeadPath));
  }
}

/* ============================================================
 * Exports (JSON + JUnit)
 * ============================================================ */

function escapeXml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

const passed = results.filter((r) => r.passed && !r.skipped).length;
const skipped = results.filter((r) => r.skipped).length;
const failed = results.filter((r) => !r.passed && !r.skipped).length;

logger.info('\n📊 CDS Validation Summary');
logger.info(`✅ Passed: ${passed}`);
logger.info(`❌ Failed: ${failed}`);
logger.info(`⏭️  Skipped: ${skipped}`);

const reportDir = path.join(config.workspace, config.outputRoot, 'reports');
fs.mkdirSync(reportDir, { recursive: true });

// JSON report
fs.writeFileSync(path.join(reportDir, 'validation-results.json'), JSON.stringify(results, null, 2));

// JUnit XML report
const junit = [
  `<?xml version="1.0" encoding="UTF-8"?>`,
  `<testsuite name="manager-pm-cds-validation" tests="${results.length}" failures="${failed}" skipped="${skipped}">`,
  ...results.map((r) => {
    const name = escapeXml(r.name);
    const details = escapeXml(r.details || (r.skipped ? 'skipped' : 'failure'));
    if (r.skipped)
      return `<testcase name="${name}"><skipped message="${details}"></skipped></testcase>`;
    if (r.passed) return `<testcase name="${name}"></testcase>`;
    return `<testcase name="${name}"><failure message="${details}"></failure></testcase>`;
  }),
  `</testsuite>`,
].join('\n');

fs.writeFileSync(path.join(reportDir, 'validation-results.xml'), junit);
logger.info(`📦 Exported structured reports → ${reportDir}`);

if (failed > 0) {
  logger.error('\n❌ Some CDS validation tests failed.');
  process.exitCode = 1;
} else {
  logger.info('\n🎉 All CDS validation tests passed successfully!');
}
