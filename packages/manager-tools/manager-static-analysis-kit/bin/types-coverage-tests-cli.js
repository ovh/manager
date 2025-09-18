#!/usr/bin/env node
import { spawnSync } from 'node:child_process';

import { logError, logInfo } from './utils/log-utils.js';

// Define the set of validation test cases for types-coverage-tests CLI
const cases = [
  // Debug only — very slow, runs across all apps
  // { name: 'Auto-discovery (all apps)', cmd: 'yarn manager-types-coverage', expect: 0 },

  { name: 'Single app (zimbra)', cmd: 'yarn manager-types-coverage --app zimbra', expect: 0 },
  {
    name: 'Multiple apps (container,zimbra,web-ongoing-operations,key-management-service)',
    cmd: 'yarn manager-types-coverage --apps container,zimbra,web-ongoing-operations,key-management-service',
    expect: 0,
  },
  {
    name: 'Single package (container)',
    cmd: 'yarn manager-types-coverage --package @ovh-ux/manager-container-app',
    expect: 0,
  },
  {
    name: 'Multiple packages (zimbra,pci-workflow)',
    cmd: 'yarn manager-types-coverage --packages @ovh-ux/manager-zimbra-app,@ovh-ux/manager-pci-workflow-app',
    expect: 0,
  },
  {
    name: 'Mixed valid+invalid apps',
    cmd: 'yarn manager-types-coverage --apps zimbra,unknown-app,container',
    expect: 0,
  },
  {
    name: 'Mixed valid+invalid packages',
    cmd: 'yarn manager-types-coverage --packages @ovh-ux/manager-zimbra-app,@ovh-ux/manager-ghost-app',
    expect: 0,
  },
  {
    name: 'All invalid apps',
    cmd: 'yarn manager-types-coverage --apps doesnotexist1,doesnotexist2',
    expect: 1,
  },
  {
    name: 'All invalid packages',
    cmd: 'yarn manager-types-coverage --packages @ovh-ux/manager-ghost-app,@ovh-ux/manager-missing-app',
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
} else {
  logInfo('\n🎉 All types-coverage-tests CLI validation tests passed!');
}
