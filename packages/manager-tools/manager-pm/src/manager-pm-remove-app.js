#!/usr/bin/env node
import { removeAppFromPnpm } from './kernel/pnpm/pnpm-apps-manager.js';
import { runAppCli } from './kernel/utils/cli-utils.js';

await runAppCli({
  actionLabel: 'remove-app',
  handler: removeAppFromPnpm,
  usage: [
    'Usage: yarn pm:remove:app --app <name|package|path>',
    'Examples:',
    '  yarn pm:remove:app --app web',
    '  yarn pm:remove:app --app packages/manager/apps/web',
    '  yarn pm:remove:app --app @ovh-ux/manager-web',
  ],
});
