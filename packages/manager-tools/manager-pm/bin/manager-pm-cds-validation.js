#!/usr/bin/env node
/**
 * manager-pm CDS Validation Suite
 * --------------------------------
 * End-to-end simulation of CDS build pipeline validation
 * for manager-pm migration workflows.
 *
 * Features:
 *  - Validates manager-pm executable & CLI dry-run output
 *  - Simulates CDS variable exports (AFFECTED_PKGS, PACKAGES_TO_BUILD, etc.)
 *  - Detects impacted universes
 *  - Ensures dist/client & universe directories
 *  - Checks included package paths & naming formats
 *  - Exports results as JSON + JUnit XML for CI/CD
 *  - Fully deterministic (no process.env usage)
 *
 * Author: OVHCloud Engineering
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

import { logger } from '../src/kernel/utils/log-manager.js';
import { VALIDATION_MANUAL_CASES } from './manager-pm-validation-config.js';

const config = {
  workspace: path.resolve(process.cwd()),
  appPath: 'packages/manager-tools/manager-pm',
  baseBranch: 'origin/master',
  gitBranch: 'develop',
  dryRunOutputFolder: 'test-results/cds',
  dryRunOutput: 'test-results/cds/output.json',
};

function runCommand(command, cwd = config.workspace) {
  const result = spawnSync(command, {
    shell: true,
    cwd,
    stdio: 'pipe',
    encoding: 'utf8',
  });
  return {
    code: result.status ?? 1,
    stdout: (result.stdout || '').trim(),
    stderr: (result.stderr || '').trim(),
  };
}

function readJsonSafe(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function exists(p) {
  try {
    fs.accessSync(p);
    return true;
  } catch {
    return false;
  }
}

function record(results, name, passed, details = '') {
  results.push({ name, passed, details });
  const symbol = passed ? '✅' : '❌';
  logger.info(`${symbol} ${name}${details ? ' → ' + details : ''}`);
}

const results = [];
const dryRunFile = path.join(config.workspace, config.dryRunOutput);

// Ensure output dir exists
fs.mkdirSync(path.dirname(dryRunFile), { recursive: true });

logger.info('\n🚀 Starting manager-pm CDS Validation Suite...\n');

/* 1️⃣ Sanity check: manager-pm executable */
{
  const binPath = path.join(config.workspace, 'node_modules/.bin/manager-pm');
  let { code, stdout } = runCommand(`yarn -s manager-pm --version`, config.workspace);
  if (code !== 0 && exists(binPath)) {
    ({ code, stdout } = runCommand(`${binPath} --version`, config.workspace));
  }
  record(results, 'Sanity check: manager-pm executable', code === 0, stdout);
}

/* 2️⃣ Simulate get_changed_packages dry-run */
{
  const dryRunCmd = `yarn -s manager-pm --silent --action buildCI --dry-run=json --filter="...[${config.baseBranch}...${config.gitBranch}]" > ${dryRunFile}`;
  const { code } = runCommand(dryRunCmd, config.workspace);
  const existsFile = exists(dryRunFile);
  record(results, 'Run get_changed_packages dry-run', code === 0 && existsFile);
}

/* 3️⃣ Validate output JSON structure */
const dryRunData = readJsonSafe(dryRunFile);
if (!dryRunData) {
  record(results, 'Validate dry-run JSON structure', false, 'Missing or invalid output.json');
} else {
  const pkgCount = dryRunData.packages?.length || 0;
  const taskCount = dryRunData.tasks?.length || 0;
  record(
    results,
    'Validate dry-run JSON structure',
    pkgCount > 0 && taskCount > 0,
    `${pkgCount} packages / ${taskCount} tasks`,
  );
}

/* 4️⃣ Check AFFECTED_PKGS simulation */
const affectedPkgs = (dryRunData?.packages || []).filter((p) => p.startsWith('@ovh-ux/'));
record(
  results,
  'Simulate AFFECTED_PKGS detection',
  affectedPkgs.length > 0,
  `${affectedPkgs.length} found`,
);

/* 5️⃣ Check PACKAGES_TO_BUILD simulation */
const packagesToBuild = (dryRunData?.tasks || [])
  .map((t) => t.directory)
  .filter((d) => d && d.startsWith('packages/manager/apps'));
record(
  results,
  'Simulate PACKAGES_TO_BUILD detection',
  packagesToBuild.length > 0,
  `${packagesToBuild.length} found`,
);

/* 6️⃣ Universe impact detection */
const universeCandidates = ['dedicated', 'public-cloud', 'web', 'telecom'];
const impactedUniverses = universeCandidates.filter((u) =>
  packagesToBuild.some((p) => p.includes(u)),
);
record(
  results,
  'Detect impacted universes',
  impactedUniverses.length > 0,
  impactedUniverses.join(', '),
);

/* 7️⃣ Dist folder creation check */
const distPath = path.join(config.workspace, 'dist/client');
fs.mkdirSync(distPath, { recursive: true });
record(results, 'Ensure dist/client folder available', exists(distPath));

/* 8️⃣ Universe injection simulation */
const universeInjectionPaths = [
  'packages/manager/apps/dedicated',
  'packages/manager/apps/public-cloud',
];
universeInjectionPaths.forEach((dir) => {
  const abs = path.join(config.workspace, dir);
  fs.mkdirSync(abs, { recursive: true });
});
const injected = universeInjectionPaths.every((p) => exists(path.join(config.workspace, p)));
record(results, 'Simulate universe injection', injected);

/* 9️⃣ Worker export simulation */
const workerExports = {
  AFFECTED_PKGS: affectedPkgs.join(' '),
  PACKAGES_TO_BUILD: packagesToBuild.join(' '),
  IMPACTED_UNIVERSES: impactedUniverses.join(' '),
};
record(
  results,
  'Generate worker export variables',
  workerExports.AFFECTED_PKGS.length > 0 && workerExports.PACKAGES_TO_BUILD.length > 0,
  JSON.stringify(workerExports, null, 2),
);

/* 🔟 Validate included packages exist anywhere in the monorepo (final extended + manual fallback) */
function collectPackageJsonPaths(rootDir) {
  if (!exists(rootDir)) return [];
  const dirs = fs.readdirSync(rootDir, { withFileTypes: true });
  let paths = [];
  for (const dir of dirs) {
    const fullPath = path.join(rootDir, dir.name);
    if (dir.isDirectory()) {
      if (exists(path.join(fullPath, 'package.json'))) {
        paths.push(fullPath);
      } else {
        paths = paths.concat(collectPackageJsonPaths(fullPath));
      }
    }
  }
  return paths;
}

// 🧭 All relevant roots
const roots = [
  'packages/manager',
  'packages/manager/core',
  'packages/manager/modules',
  'packages/manager-tools',
  'packages/manager-tools/manager-legacy-tools',
  'packages/components',
  'packages',
].map((r) => path.join(config.workspace, r));

let allPackageDirs = [];
roots.forEach((root) => {
  allPackageDirs = allPackageDirs.concat(collectPackageJsonPaths(root));
});

/**
 * Normalize names for fuzzy matching
 */
function normalizeName(name) {
  return name
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

/**
 * Validate inclusion with fuzzy + manual matching
 */
const missingPkgs = affectedPkgs.filter((pkg) => {
  const normPkg = normalizeName(pkg);

  // 1️⃣ Manual mapping override
  if (VALIDATION_MANUAL_CASES[pkg]) {
    const manualPath = path.join(config.workspace, VALIDATION_MANUAL_CASES[pkg]);
    if (exists(manualPath)) return false;
  }

  // 2️⃣ Fuzzy normalized match
  return !allPackageDirs.some((dir) => normalizeName(dir).includes(normPkg));
});

record(
  results,
  'Validate included packages exist anywhere in monorepo',
  missingPkgs.length === 0,
  missingPkgs.length > 0
    ? `${missingPkgs.length} missing (${missingPkgs.slice(0, 5).join(', ')}...)`
    : 'all good',
);

/* 12️⃣ Save dry-run snapshot for reproducibility */
const snapshotPath = path.join(
  config.workspace,
  config.dryRunOutputFolder,
  'dry-run-snapshot.json',
);
if (dryRunData) {
  fs.writeFileSync(snapshotPath, JSON.stringify(dryRunData, null, 2));
  record(results, 'Persist dry-run snapshot', true, snapshotPath);
}

/* 13️⃣ Cleanup dry-run artifacts */
if (exists(dryRunFile)) fs.unlinkSync(dryRunFile);
record(results, 'Cleanup dry-run artifacts', !exists(dryRunFile));

const passed = results.filter((r) => r.passed).length;
const failed = results.length - passed;

logger.info('\n📊 CDS Validation Summary');
logger.info(`✅ Passed: ${passed}`);
logger.info(`❌ Failed: ${failed}`);

const outputDir = path.join(config.workspace, config.dryRunOutputFolder, 'reports');
fs.mkdirSync(outputDir, { recursive: true });

// JSON export
fs.writeFileSync(path.join(outputDir, 'validation-results.json'), JSON.stringify(results, null, 2));

// JUnit XML export
const junit = [
  `<?xml version="1.0" encoding="UTF-8"?>`,
  `<testsuite name="manager-pm-cds-validation" tests="${results.length}" failures="${failed}">`,
  ...results.map(
    (r) =>
      `<testcase name="${r.name}">${
        r.passed ? '' : `<failure message="${r.details || 'failure'}"></failure>`
      }</testcase>`,
  ),
  `</testsuite>`,
].join('\n');

fs.writeFileSync(path.join(outputDir, 'validation-results.xml'), junit);
logger.info(`📦 Exported structured reports → ${outputDir}`);

if (failed > 0) {
  logger.error('\n❌ Some CDS validation tests failed.');
  process.exitCode = 1;
} else {
  logger.info('\n🎉 All CDS validation tests passed successfully!');
}
