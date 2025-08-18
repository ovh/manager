#!/usr/bin/env node
import { addAppToPnpm } from './kernel/pnpm/pnpm-apps-manager.js';
import { runAppCli } from './kernel/utils/cli-utils.js';

await runAppCli({
  actionLabel: 'add-app',
  handler: addAppToPnpm,
  usage: [
    'Usage: yarn pm:add:app --app <name|package|path>',
    'Examples:',
    '  yarn pm:add:app --app web',
    '  yarn pm:add:app --app packages/manager/apps/web',
    '  yarn pm:add:app --app @ovh-ux/manager-web',
  ],
});
