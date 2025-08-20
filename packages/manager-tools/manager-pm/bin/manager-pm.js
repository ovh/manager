#!/usr/bin/env node
import { program } from 'commander';
import { consola } from 'consola';
import process from 'process';

import { addAppToPnpm, removeAppFromPnpm } from '../dist/src/kernel/pnpm/pnpm-apps-manager.js';
import { bootstrapPnpm } from '../dist/src/kernel/pnpm/pnpm-bootstrap.js';
import { installAppDeps, linkPrivateDeps } from '../dist/src/kernel/pnpm/pnpm-deps-manager.js';
import { startApp } from '../dist/src/kernel/pnpm/pnpm-start-app.js';
import { buildApp, lintApp, testApp } from '../dist/src/kernel/pnpm/pnpm-tasks-manager.js';

/**
 * Dictionary of all supported actions across package managers.
 */
const actions = {
  bootstrap: { desc: 'Bootstrap the package manager (install binary)', needsApp: false },
  linkPrivates: { desc: 'Link all private packages into local pnpm store', needsApp: false },
  add: { desc: 'Add an app to the workflow', needsApp: true },
  remove: { desc: 'Remove an app from the workflow', needsApp: true },
  install: { desc: 'Install dependencies for an app', needsApp: true },
  build: { desc: 'Build an app', needsApp: true },
  test: { desc: 'Run tests for an app', needsApp: true },
  lint: { desc: 'Run lint for an app', needsApp: true },
  start: { desc: 'Start an app', needsApp: false },
  help: { desc: 'Show help for manager-pm CLI', needsApp: false },
  'full-install': { desc: 'Bootstrap + link privates + install all apps', needsApp: false },
  'full-build': { desc: 'Build all apps (Yarn + PNPM)', needsApp: false },
  'full-test': { desc: 'Run tests across all apps', needsApp: false },
  'full-lint': { desc: 'Run lint across all apps', needsApp: false },
  'full-start': { desc: 'Interactive start across all apps', needsApp: false },
};

/**
 * Package manager implementations.
 * Each action corresponds to a pnpm workflow command.
 */
const packageManagers = {
  pnpm: {
    help: () => program.help(),
    bootstrap: async () => {
      consola.info(`[pnpm] bootstrap → This will install the pnpm binary.`);
      await bootstrapPnpm();
    },
    linkPrivates: async () => {
      consola.info(`[pnpm] linkPrivates → Linking all private deps to local store.`);
      await linkPrivateDeps();
    },
    add: async (app) => {
      consola.info(`[pnpm] add → This will add app "${app}" to the pnpm workflow.`);
      await addAppToPnpm(app);
    },
    remove: async (app) => {
      consola.info(`[pnpm] remove → This will remove app "${app}" from the pnpm workflow.`);
      await removeAppFromPnpm(app);
    },
    install: async (app) => {
      consola.info(`[pnpm] install → This will install dependencies for app "${app}".`);
      await installAppDeps(app);
    },
    build: async (app) => {
      consola.info(`[pnpm] build → This will build app "${app}".`);
      await buildApp(app);
    },
    test: async (app) => {
      consola.info(`[pnpm] test → This will run tests for app "${app}".`);
      await testApp(app);
    },
    lint: async (app) => {
      consola.info(`[pnpm] lint → This will run lint for app "${app}".`);
      await lintApp(app);
    },
    start: async () => {
      consola.info(`[pnpm] start  → This will start an application using prompts`);
      await startApp();
    },
    'full-install': async () => {
      consola.info(
        `[pnpm] full-install → Will run bootstrap, link privates, and install all PNPM apps.`,
      );
    },
    'full-build': async () => {
      consola.info(`[pnpm] full-build → Will build all apps (Yarn + PNPM).`);
    },
    'full-test': async () => {
      consola.info(`[pnpm] full-test → Will test all apps (Yarn + PNPM).`);
    },
    'full-lint': async () => {
      consola.info(`[pnpm] full-lint → Will lint all apps (Yarn + PNPM).`);
    },
    'full-start': async () => {
      consola.info(`[pnpm] full-start → Will provide interactive prompts to start an app.`);
    },
  },
};

const supportedTypes = Object.keys(packageManagers);

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
  .option('--app <name>', 'Target app name (required for app-specific actions)')
  .option('--region <region>', 'Region to start app in (default: EU)', 'EU')
  .option('--container', 'Run inside container', false);

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

    if (actions[opts.action]?.needsApp && !opts.app) {
      consola.error(`❌ Action "${opts.action}" requires --app <name>.`);
      process.exit(1);
    }

    // Pass options explicitly for start
    if (opts.action === 'start') {
      await handler(opts.app, { region: opts.region, container: opts.container });
    } else {
      await handler(opts.app);
    }

    process.exit(0);
  }

  program.help();
})();
