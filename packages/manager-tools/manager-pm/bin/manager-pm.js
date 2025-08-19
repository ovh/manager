#!/usr/bin/env node
import { program } from 'commander';
import { consola } from 'consola';
import process from 'process';

import { addAppToPnpm } from '../dist/src/kernel/pnpm/pnpm-add-app.js';
import { removeAppFromPnpm } from '../dist/src/kernel/pnpm/pnpm-remove-app.js';

/**
 * Dictionary of all supported actions across package managers.
 */
const actions = {
  bootstrap: 'Bootstrap the package manager (install binary)',
  add: 'Add an app to the workflow',
  remove: 'Remove an app from the workflow',
  install: 'Install dependencies for an app',
  build: 'Build an app',
  test: 'Run tests for an app',
  start: 'Start an app',
  help: 'Show help for manager-pm CLI',
};

/**
 * Package manager implementations.
 */
const packageManagers = {
  pnpm: {
    bootstrap: () => consola.info(`[pnpm] bootstrap → This will install the pnpm binary.`),
    add: async (app) => {
      consola.info(`[pnpm] add → This will add app "${app}" to the pnpm workflow.`);
      await addAppToPnpm(app);
    },
    remove: async (app) => {
      consola.info(`[pnpm] remove → This will remove app "${app}" from the pnpm workflow.`);
      await removeAppFromPnpm(app);
    },
    install: (app) =>
      consola.info(`[pnpm] install → This will install dependencies for app "${app}".`),
    build: (app) => consola.info(`[pnpm] build → This will build app "${app}".`),
    test: (app) => consola.info(`[pnpm] test → This will run tests for app "${app}".`),
    start: (app) => consola.info(`[pnpm] start → This will start app "${app}".`),
    help: () => program.help(),
  },
};

const supportedTypes = Object.keys(packageManagers);

// -----------------------------
// Special-case: handle --list before parsing
// -----------------------------
if (process.argv.includes('--list')) {
  consola.info(`[global] list → This will list all apps managed across package managers.`);
  process.exit(0);
}

// -----------------------------
// CLI setup
// -----------------------------
program
  .name('manager-pm')
  .description('Manager Package Manager CLI (incremental pnpm adoption)')
  .version('0.1.0');

program
  .option('--type <type>', `package manager type (${supportedTypes.join(', ')})`, supportedTypes[0])
  .option('--action <name>', `action (${Object.keys(actions).join('|')})`)
  .option('--app <name>', 'Target app name (required for app-specific actions)');

program.parse(process.argv);
const opts = program.opts();

// -----------------------------
// Dispatch
// -----------------------------
(async () => {
  if (opts.action) {
    const handler = packageManagers[opts.type]?.[opts.action];
    if (!handler) {
      consola.error(`❌ Action "${opts.action}" not supported for package manager "${opts.type}".`);
      process.exit(1);
    }

    // Actions requiring an app
    if (['add', 'remove', 'install', 'build', 'test', 'start'].includes(opts.action) && !opts.app) {
      consola.error(`❌ Action "${opts.action}" requires --app <name>.`);
      process.exit(1);
    }

    await handler(opts.app);
    process.exit(0);
  }

  // If no action/list provided, show help
  program.help();
})();
