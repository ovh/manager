#!/usr/bin/env node
import { spawnSync } from 'node:child_process';

import { logError, logInfo } from './utils/log-utils.js';

// Define the set of validation test cases for code-duplication CLI
const cases = [
  { name: 'Single app (zimbra)', cmd: 'yarn manager-code-duplication --app zimbra', expect: 0 },
  {
    name: 'Multiple apps (container,zimbra)',
    cmd: 'yarn manager-code-duplication --apps container,zimbra',
    expect: 0,
  },
  {
    name: 'Single package (container)',
    cmd: 'yarn manager-code-duplication --package @ovh-ux/manager-container-app',
    expect: 0,
  },
  {
    name: 'Multiple packages (zimbra,pci-workflow)',
    cmd: 'yarn manager-code-duplication --packages @ovh-ux/manager-zimbra-app,@ovh-ux/manager-pci-workflow-app',
    expect: 0,
  },
  {
    name: 'Single library static path by folder name (manager-react-components)',
    cmd: 'yarn manager-code-duplication --library manager-react-components',
    expect: 0,
  },
  {
    name: 'Single library static path by package name (manager-react-components)',
    cmd: 'yarn manager-code-duplication --library @ovh-ux/manager-react-components',
    expect: 0,
  },
  {
    name: 'Single library dynamic path by folder name (shell-client)',
    cmd: 'yarn manager-code-duplication --library shell-client',
    expect: 0,
  },
  {
    name: 'Single library static path by package name (shell-client)',
    cmd: 'yarn manager-code-duplication --library @ovh-ux/manager-react-shell-client',
    expect: 0,
  },
  {
    name: 'Multiple libraries by folder names (manager-wiki,manager-react-components,shell-client,logs-to-customer)',
    cmd: 'yarn manager-code-duplication --libraries manager-wiki,manager-react-components,shell-client,logs-to-customer',
    expect: 0,
  },
  {
    name: 'Multiple libraries by package names (manager-wiki,manager-react-components,shell-client,logs-to-customer)',
    cmd: 'yarn manager-code-duplication --libraries @ovh-ux/manager-wiki,@ovh-ux/manager-react-components,@ovh-ux/manager-react-shell-client,@ovh-ux/logs-to-customer',
    expect: 0,
  },
  {
    name: 'Mixed valid+invalid apps',
    cmd: 'yarn manager-code-duplication --apps zimbra,unknown-app,container',
    expect: 0,
  },
  {
    name: 'Mixed valid+invalid packages',
    cmd: 'yarn manager-code-duplication --packages @ovh-ux/manager-wiki,manager-react-components,@ovh-ux/manager-ghost-app',
    expect: 0,
  },
  {
    name: 'Mixed valid+invalid libraries',
    cmd: 'yarn manager-code-duplication --libraries @ovh-ux/manager-zimbra-app,@ovh-ux/manager-ghost-app',
    expect: 0,
  },
  {
    name: 'All invalid apps',
    cmd: 'yarn manager-code-duplication --apps doesnotexist1,doesnotexist2',
    expect: 1,
  },
  {
    name: 'All invalid packages',
    cmd: 'yarn manager-code-duplication --packages @ovh-ux/manager-ghost-app,@ovh-ux/manager-missing-app',
    expect: 1,
  },
  {
    name: 'Turbo build failure simulation (pci-ai-tools)',
    cmd: 'yarn manager-code-duplication --app pci-ai-tools',
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
  logInfo('\n🎉 All code-duplication-tests CLI validation tests passed!');
}
