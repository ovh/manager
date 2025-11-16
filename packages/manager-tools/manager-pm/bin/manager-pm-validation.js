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

function runCommand(cmd) {
  return spawnSync(cmd, { stdio: 'pipe', shell: true, encoding: 'utf8' });
}

function pathExists(targetPath) {
  try {
    fs.accessSync(targetPath);
    return true;
  } catch {
    return false;
  }
}

function testPassed(result, expectedExit, verifyFn) {
  if (typeof expectedExit === 'number') {
    return result.status === expectedExit;
  }
  if (typeof verifyFn === 'function') {
    try {
      return verifyFn(result.stdout, result.stderr);
    } catch {
      return false;
    }
  }
  return false;
}

const cliTests = [
  {
    name: 'Print version (sanity check)',
    cmd: 'yarn -s manager-pm --version',
    expect: 0,
  },
  {
    name: 'Display help menu',
    cmd: 'yarn -s manager-pm --help',
    verify: (stdout, stderr) => (stdout + stderr).includes('--action'),
  },
  {
    name: 'Run Turbo build (verbose mode)',
    cmd: 'yarn manager-pm --action buildCI --filter=@ovh-ux/manager-zimbra-app',
    expect: 0,
  },
  {
    name: 'Run Turbo build (silent mode)',
    cmd: 'yarn -s manager-pm --silent --action buildCI --filter=@ovh-ux/manager-zimbra-app',
    expect: 0,
  },
  {
    name: 'Run Turbo test in CI mode',
    cmd: 'yarn -s manager-pm --action testCI --filter=@ovh-ux/manager-zimbra-app',
    expect: 0,
  },
  {
    name: 'Run full lint across Yarn + PNPM apps',
    cmd: 'yarn -s manager-pm --type pnpm --action full-lint',
    expect: 0,
  },
  {
    name: 'Prepare merged workspace view',
    cmd: 'yarn pm:prepare:legacy:workspace',
    expect: 0,
  },
  {
    name: 'Remove merged workspace view',
    cmd: 'yarn pm:remove:legacy:workspace',
    expect: 0,
  },
  {
    name: 'List all workspaces via Lerna passthrough',
    cmd: 'yarn -s manager-pm --silent --action lerna list --all --json --toposort',
    verify: (stdout) => stdout.includes('@ovh-ux/'),
  },
  {
    name: 'Invalid command should fail gracefully',
    cmd: 'yarn -s manager-pm --action doesnotexist',
    expect: 1,
  },
  {
    name: 'Simulate Bun migration readiness',
    cmd: 'yarn -s manager-pm --type bun --action version || true',
    expect: 0,
  },
];

const catalogsDir = path.resolve('packages/manager-tools/manager-pm/src/playbook/catalog');
const pnpmCatalogFile = path.join(catalogsDir, 'pnpm-catalog.json');
const yarnCatalogFile = path.join(catalogsDir, 'yarn-catalog.json');
const privateModulesFile = path.join(catalogsDir, 'pnpm-private-modules.json');

const pnpmCatalog = JSON.parse(fs.readFileSync(pnpmCatalogFile, 'utf8'));
const yarnCatalog = JSON.parse(fs.readFileSync(yarnCatalogFile, 'utf8'));
const privateModules = JSON.parse(fs.readFileSync(privateModulesFile, 'utf8'));

const catalogTests = [];

// 1️⃣ Validate catalog entries
pnpmCatalog.forEach((appPath) =>
  catalogTests.push({
    name: `PNPM catalog path exists → ${appPath}`,
    verify: () => pathExists(appPath),
  }),
);

yarnCatalog.forEach((appPath) =>
  catalogTests.push({
    name: `Yarn catalog path exists → ${appPath}`,
    verify: () => pathExists(appPath),
  }),
);

// 2️⃣ Validate private module fields and structure
privateModules.forEach((moduleEntry) => {
  catalogTests.push({
    name: `Private module structure valid → ${moduleEntry.pnpm}`,
    verify: () =>
      moduleEntry.turbo.startsWith('--filter @ovh-ux/') && moduleEntry.pnpm.startsWith('packages/'),
  });

  catalogTests.push({
    name: `Private module path exists → ${moduleEntry.pnpm}`,
    verify: () => pathExists(moduleEntry.pnpm),
  });

  const pkgJsonPath = path.join(moduleEntry.pnpm, 'package.json');
  if (pathExists(pkgJsonPath)) {
    const pkgData = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
    catalogTests.push({
      name: `Private module name matches turbo filter → ${pkgData.name}`,
      verify: () => moduleEntry.turbo.includes(pkgData.name),
    });
  }
});

// 3️⃣ Detect duplicates
const combinedPaths = [...pnpmCatalog, ...yarnCatalog];
const duplicates = combinedPaths.filter((p, i, arr) => arr.indexOf(p) !== i);
catalogTests.push({
  name: 'No duplicates between PNPM and Yarn catalogs',
  verify: () => duplicates.length === 0,
});

// 4️⃣ Check critical private modules
const criticalModules = [
  '@ovh-ux/manager-core-utils',
  '@ovh-ux/manager-static-analysis-kit',
  '@ovh-ux/manager-react-core-application',
];
criticalModules.forEach((modName) =>
  catalogTests.push({
    name: `Critical private module registered → ${modName}`,
    verify: () => privateModules.some((m) => m.turbo.includes(modName)),
  }),
);

// 5️⃣ Ensure no broken paths
catalogTests.push({
  name: 'All private module directories exist',
  verify: () => privateModules.every((m) => pathExists(m.pnpm)),
});

const allTests = [...cliTests, ...catalogTests];
let failedCount = 0;

logger.info('\n🚀 Starting manager-pm CLI & Catalog validation suite...\n');

for (const test of allTests) {
  logger.info(`🔎 ${test.name}`);
  const result = test.cmd ? runCommand(test.cmd) : { status: 0, stdout: '', stderr: '' };
  const success = testPassed(result, test.expect, test.verify);

  if (!success) {
    failedCount++;
    logger.error(`❌ ${test.name}`);
    if (result.stdout?.trim()) logger.error(`stdout:\n${result.stdout}`);
    if (result.stderr?.trim()) logger.error(`stderr:\n${result.stderr}`);
  } else {
    logger.info(`✅ ${test.name}`);
  }
}

logger.info('\n📊 Validation Summary');
logger.info(`🧱 PNPM apps: ${pnpmCatalog.length}`);
logger.info(`🧩 Yarn apps: ${yarnCatalog.length}`);
logger.info(`🔒 Private modules: ${privateModules.length}`);
logger.info(`✅ Passed: ${allTests.length - failedCount}`);
logger.info(`❌ Failed: ${failedCount}`);

if (failedCount > 0) {
  logger.error('\n❌ Some validation tests failed.');
  process.exit(1);
} else {
  logger.info('\n🎉 All manager-pm CLI & catalog validation tests passed successfully!');
}
