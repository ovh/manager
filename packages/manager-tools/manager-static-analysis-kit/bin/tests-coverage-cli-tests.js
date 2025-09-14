#!/usr/bin/env node
/**
 * Smoke/validation tests for the "manager-tests-coverage" CLI.
 *
 * Runs a set of representative invocations and asserts on exit codes:
 *  - Exit 0 when at least one valid target is analyzed.
 *  - Exit 1 when all provided targets are invalid.
 *
 * NOTE:
 *  - This does not assert on report contents, only that the CLI finishes
 *    with the expected status and doesn’t crash.
 *  - Keep the “all apps” case commented unless you need a full-run debug;
 *    it’s slow because it builds/tests everything with Turbo.
 */
import { spawnSync } from 'node:child_process';
import process from 'node:process';

import { logError, logInfo } from './utils/log-utils.js';

const cases = [
  // Debug only — very slow, runs across all apps
  // { name: 'Auto-discovery (all apps)', cmd: 'yarn manager-tests-coverage', expect: 0 },

  { name: 'Single app (zimbra)', cmd: 'yarn manager-tests-coverage --app zimbra', expect: 0 },
  {
    name: 'Multiple apps (container,zimbra,web-ongoing-operations,key-management-service)',
    cmd: 'yarn manager-tests-coverage --apps container,zimbra,web-ongoing-operations,key-management-service',
    expect: 0,
  },
  {
    name: 'Single package (container)',
    cmd: 'yarn manager-tests-coverage --package @ovh-ux/manager-container-app',
    expect: 0,
  },
  {
    name: 'Multiple packages (zimbra,pci-workflow)',
    cmd: 'yarn manager-tests-coverage --packages @ovh-ux/manager-zimbra-app,@ovh-ux/manager-pci-workflow-app',
    expect: 0,
  },
  {
    name: 'Mixed valid+invalid apps',
    cmd: 'yarn manager-tests-coverage --apps zimbra,unknown-app,container',
    expect: 0,
  },
  {
    name: 'Mixed valid+invalid packages',
    cmd: 'yarn manager-tests-coverage --packages @ovh-ux/manager-zimbra-app,@ovh-ux/manager-ghost-app',
    expect: 0,
  },
  {
    name: 'All invalid apps',
    cmd: 'yarn manager-tests-coverage --apps doesnotexist1,doesnotexist2',
    expect: 1,
  },
  {
    name: 'All invalid packages',
    cmd: 'yarn manager-tests-coverage --packages @ovh-ux/manager-ghost-app,@ovh-ux/manager-missing-app',
    expect: 1,
  },
];

let failed = 0;

for (const test of cases) {
  logInfo(`\n🔎 Running: ${test.name}`);
  const [bin, ...args] = test.cmd.split(' ');
  const result = spawnSync(bin, args, { stdio: 'inherit', shell: true });

  if (result.status !== test.expect) {
    logError(`❌ ${test.name} failed (expected exit ${test.expect}, got ${result.status})`);
    failed++;
  } else {
    logInfo(`✅ ${test.name} passed`);
  }
}

if (failed > 0) {
  logError(`\n❌ ${failed} test(s) failed.`);
  process.exit(1);
} else {
  logInfo('\n🎉 All tests-coverage CLI validation tests passed!');
}
