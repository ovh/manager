#!/usr/bin/env node
import { spawnSync } from 'node:child_process';

import { logError, logInfo } from './utils/log-utils.js';

// Define the set of validation test cases
const cases = [
  { name: 'Single app (zimbra)', cmd: 'yarn manager-perf-budgets --app zimbra', expect: 0 },
  {
    name: 'Multiple apps (container,zimbra)',
    cmd: 'yarn manager-perf-budgets --apps container,zimbra',
    expect: 0,
  },
  {
    name: 'Single package (container)',
    cmd: 'yarn manager-perf-budgets --package @ovh-ux/manager-container-app',
    expect: 0,
  },
  {
    name: 'Multiple packages (zimbra,pci-workflow)',
    cmd: 'yarn manager-perf-budgets --packages @ovh-ux/manager-zimbra-app,@ovh-ux/manager-pci-workflow-app',
    expect: 0,
  },
  {
    name: 'Single library static path by folder name (manager-ui-kit)',
    cmd: 'yarn manager-perf-budgets --library manager-ui-kit',
    expect: 0,
  },
  {
    name: 'Single library static path by package name (manager-ui-kit)',
    cmd: 'yarn manager-perf-budgets --library @ovh-ux/muk',
    expect: 0,
  },
  {
    name: 'Single library dynamic path by folder name (shell-client)',
    cmd: 'yarn manager-perf-budgets --library shell-client',
    expect: 0,
  },
  {
    name: 'Single library static path by package name (shell-client)',
    cmd: 'yarn manager-perf-budgets --library @ovh-ux/manager-react-shell-client',
    expect: 0,
  },
  {
    name: 'Multiple libraries by folder names (manager-wiki,manager-ui-kit,shell-client,logs-to-customer)',
    cmd: 'yarn manager-perf-budgets --libraries manager-wiki,manager-ui-kit,shell-client,logs-to-customer',
    expect: 0,
  },
  {
    name: 'Multiple libraries by package names (manager-wiki,manager-ui-kit,shell-client,logs-to-customer)',
    cmd: 'yarn manager-perf-budgets --libraries @ovh-ux/manager-wiki,@ovh-ux/muk,@ovh-ux/manager-react-shell-client,@ovh-ux/logs-to-customer',
    expect: 0,
  },
  {
    name: 'Mixed valid+invalid apps',
    cmd: 'yarn manager-perf-budgets --apps zimbra,unknown-app,container',
    expect: 0,
  },
  {
    name: 'Mixed valid+invalid packages',
    cmd: 'yarn manager-perf-budgets --packages @ovh-ux/manager-wiki,manager-ui-kit,@ovh-ux/manager-ghost-app',
    expect: 0,
  },
  {
    name: 'Mixed valid+invalid libraries',
    cmd: 'yarn manager-perf-budgets --libraries @ovh-ux/manager-zimbra-app,@ovh-ux/manager-ghost-app',
    expect: 0,
  },
  {
    name: 'All invalid apps',
    cmd: 'yarn manager-perf-budgets --apps doesnotexist1,doesnotexist2',
    expect: 1,
  },
  {
    name: 'All invalid packages',
    cmd: 'yarn manager-perf-budgets --packages @ovh-ux/manager-ghost-app,@ovh-ux/manager-missing-app',
    expect: 1,
  },
  {
    name: 'Turbo build failure simulation (pci-ai-tools)',
    cmd: 'yarn manager-perf-budgets --app pci-ai-tools',
    expect: 0,
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
  logInfo('\n🎉 All perf-budgets CLI validation tests passed!');
}
