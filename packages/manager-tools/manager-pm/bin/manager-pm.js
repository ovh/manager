#!/usr/bin/env node
import { program } from 'commander';
import { consola } from 'consola';
import process from 'process';

import { addAppToPnpm, removeAppFromPnpm } from '../dist/src/kernel/pnpm/pnpm-apps-manager.js';
import { bootstrapPnpm } from '../dist/src/kernel/pnpm/pnpm-bootstrap.js';
import {
  installAppDeps,
  yarnPostInstall,
  yarnPreInstall,
} from '../dist/src/kernel/pnpm/pnpm-deps-manager.js';
import { startApp } from '../dist/src/kernel/pnpm/pnpm-start-app.js';
import {
  buildAll,
  buildApp,
  lintAll,
  lintApp,
  testAll,
  testApp,
} from '../dist/src/kernel/pnpm/pnpm-tasks-manager.js';

/**
 * Dictionary of all supported actions across package managers.
 */
const actions = {
  bootstrap: { desc: 'Download and validate PNPM binary (idempotent)', needsApp: false },
  add: { desc: 'Add an app (by path or name) to the PNPM catalog', needsApp: true },
  remove: { desc: 'Remove an app (by path or name) from the PNPM catalog', needsApp: true },
  install: {
    desc: 'Install dependencies for a PNPM-managed app (pass --app as path)',
    needsApp: true,
  },
  build: { desc: 'Build a single app (merged Yarn ∪ PNPM view)', needsApp: true },
  test: { desc: 'Run tests for a single app (merged Yarn ∪ PNPM view)', needsApp: true },
  lint: { desc: 'Run lint for a single app (merged Yarn ∪ PNPM view)', needsApp: true },
  start: { desc: 'Interactively start an app (prompts)', needsApp: false },
  help: { desc: 'Show help for manager-pm CLI', needsApp: false },
  'full-build': { desc: 'Build all apps (Yarn + PNPM)', needsApp: false },
  'full-test': { desc: 'Run tests across all apps', needsApp: false },
  'full-lint': { desc: 'Run lint across all apps', needsApp: false },
  'pre-install': {
    desc: 'Prepare Yarn install: set root workspaces.packages to Yarn-only',
    needsApp: false,
  },
  'post-install': {
    desc: 'After Yarn install: bootstrap PNPM, build+link privates, install PNPM apps, restore merged workspaces',
    needsApp: false,
  },
};

/**
 * Package manager implementations.
 * Each action corresponds to a pnpm workflow command.
 */
const packageManagers = {
  pnpm: {
    help: () => program.help(),
    bootstrap: async () => {
      consola.start(`[pnpm/bootstrap] Downloading and validating PNPM binary…`);
      await bootstrapPnpm();
      consola.success(`[pnpm/bootstrap] PNPM is ready.`);
    },
    add: async (app) => {
      consola.start(`[pnpm/add] Adding app "${app}" to PNPM catalog…`);
      await addAppToPnpm(app);
      consola.success(`[pnpm/add] Added: ${app}`);
    },
    remove: async (app) => {
      consola.start(`[pnpm/remove] Removing app "${app}" from PNPM catalog…`);
      await removeAppFromPnpm(app);
      consola.success(`[pnpm/remove] Removed: ${app}`);
    },
    install: async (app) => {
      consola.start(`[pnpm/install] Installing dependencies for app "${app}"…`);
      await installAppDeps(app);
    },
    build: async (app) => {
      consola.start(`[pnpm/build] Building app "${app}"…`);
      await buildApp(app);
      consola.success(`[pnpm/build] Build complete: ${app}`);
    },
    test: async (app) => {
      consola.start(`[pnpm/test] Running tests for app "${app}"…`);
      await testApp(app);
      consola.success(`[pnpm/test] Tests completed: ${app}`);
    },
    lint: async (app) => {
      consola.start(`[pnpm/lint] Linting app "${app}"…`);
      await lintApp(app);
      consola.success(`[pnpm/lint] Lint completed: ${app}`);
    },
    start: async () => {
      consola.start(`[pnpm/start] Launching interactive app starter…`);
      await startApp();
      consola.success(`[pnpm/start] Done.`);
    },
    'full-build': async () => {
      consola.start(`[pnpm/full-build] Building ALL apps across merged Yarn + PNPM catalogs…`);
      await buildAll();
      consola.success(`[pnpm/full-build] All builds completed.`);
    },
    'full-test': async () => {
      consola.start(`[pnpm/full-test] Running tests across ALL apps…`);
      await testAll();
    },
    'full-lint': async () => {
      consola.start(`[pnpm/full-lint] Running lint across ALL apps…`);
      await lintAll();
    },
    'pre-install': async () => {
      consola.info(
        `[pnpm/pre-install] Preparing Yarn install: switching root workspaces to Yarn-only…`,
      );
      await yarnPreInstall();
      consola.info(`[pnpm/pre-install] Root workspaces set to Yarn-only.`);
    },
    'post-install': async () => {
      consola.info(
        `[pnpm/post-install] Finalizing install: bootstrap PNPM, build+link privates, install PNPM apps, restore merged workspaces…`,
      );
      await yarnPostInstall();
      consola.info(`[pnpm/post-install] PNPM ready; PNPM apps installed; workspaces restored.`);
    },
  },
};

const supportedTypes = Object.keys(packageManagers);

// -----------------------------
// CLI setup
// -----------------------------
program
  .name('manager-pm')
  .description('manager-pm — Hybrid Yarn + PNPM orchestration for incremental adoption')
  .version('0.1.0')
  .usage('--type pnpm --action <action> [--app <name-or-path>]')
  .showHelpAfterError(true);

program
  .option('--type <type>', `package manager type (${supportedTypes.join(', ')})`, supportedTypes[0])
  .option('--action <name>', `action (${Object.keys(actions).join('|')})`)
  .option('--app <name>', 'Target app name (required for app-specific actions)')
  .option('--region <region>', 'Region to start app in (default: EU)', 'EU')
  .option('--container', 'Run inside container', false);

program.parse(process.argv);
const opts = program.opts();
consola.box(
  `manager-pm v${program.opts().version || '0.1.0'}\ntype: ${opts.type}\naction: ${opts.action || '(none)'}\napp: ${opts.app || '(none)'}\nregion: ${opts.region}\ncontainer: ${opts.container}`,
);

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
