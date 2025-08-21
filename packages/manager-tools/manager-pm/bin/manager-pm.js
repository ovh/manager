#!/usr/bin/env node
import { program } from 'commander';
import process from 'process';

import { addAppToPnpm, removeAppFromPnpm } from '../src/kernel/pnpm/pnpm-apps-manager.js';
import { bootstrapPnpm } from '../src/kernel/pnpm/pnpm-bootstrap.js';
import { installAppDeps, yarnPostInstall, yarnPreInstall } from '../src/kernel/pnpm/pnpm-deps-manager.js';
import { startApp } from '../src/kernel/pnpm/pnpm-start-app.js';
import { buildAll, buildApp, lintAll, lintApp, testAll, testApp } from '../src/kernel/pnpm/pnpm-tasks-manager.js';

import { logger } from '../src/kernel/commons/log-manager.js';

const actions = {
  bootstrap:     { desc: 'Download and validate PNPM binary (idempotent)', needsApp: false },
  add:           { desc: 'Add an app (name or path) to the PNPM catalog', needsApp: true },
  remove:        { desc: 'Remove an app (name or path) from the PNPM catalog', needsApp: true },
  install:       { desc: 'Install dependencies for a PNPM-managed app (pass --app as path)', needsApp: true },
  build:         { desc: 'Build a single app (merged Yarn ∪ PNPM view)', needsApp: true },
  test:          { desc: 'Run tests for a single app (merged view)', needsApp: true },
  lint:          { desc: 'Run lint for a single app (merged view)', needsApp: true },
  start:         { desc: 'Interactively start an app (prompts)', needsApp: false },
  help:          { desc: 'Show help for manager-pm CLI', needsApp: false },
  'full-build':  { desc: 'Build all apps across Yarn + PNPM catalogs', needsApp: false },
  'full-test':   { desc: 'Run tests across all apps (Yarn + PNPM)', needsApp: false },
  'full-lint':   { desc: 'Run lint across all apps (Yarn + PNPM)', needsApp: false },
  'pre-install': { desc: 'Set root workspaces.packages to Yarn-only', needsApp: false },
  'post-install':{ desc: 'Bootstrap PNPM, build+link privates, install PNPM apps, restore merged workspaces', needsApp: false }
};

const packageManagers = {
  pnpm: {
    help: () => program.help(),
    bootstrap: async () => {
      logger.info('[pnpm/bootstrap] Downloading and validating PNPM binary…');
      await bootstrapPnpm();
      logger.success('[pnpm/bootstrap] PNPM is ready.');
    },
    add: async (app) => {
      logger.info(`[pnpm/add] Adding "${app}" to PNPM catalog…`);
      await addAppToPnpm(app);
      logger.success(`[pnpm/add] Added: ${app}`);
    },
    remove: async (app) => {
      logger.info(`[pnpm/remove] Removing "${app}" from PNPM catalog…`);
      await removeAppFromPnpm(app);
      logger.success(`[pnpm/remove] Removed: ${app}`);
    },
    install: async (app) => {
      logger.info(`[pnpm/install] Installing deps for "${app}"…`);
      await installAppDeps(app);
      logger.success(`[pnpm/install] Installed: ${app}`);
    },
    build: async (app) => {
      logger.info(`[pnpm/build] Building "${app}"…`);
      await buildApp(app);
      logger.success(`[pnpm/build] Done: ${app}`);
    },
    test: async (app) => {
      logger.info(`[pnpm/test] Testing "${app}"…`);
      await testApp(app);
      logger.success(`[pnpm/test] Done: ${app}`);
    },
    lint: async (app) => {
      logger.info(`[pnpm/lint] Linting "${app}"…`);
      await lintApp(app);
      logger.success(`[pnpm/lint] Done: ${app}`);
    },
    start: async () => {
      logger.info('[pnpm/start] Launching interactive app starter…');
      await startApp();
      logger.success('[pnpm/start] Done.');
    },
    'full-build': async () => {
      logger.info('[pnpm/full-build] Building ALL apps across merged Yarn + PNPM catalogs…');
      await buildAll();
      logger.success('[pnpm/full-build] All builds completed.');
    },
    'full-test': async () => {
      logger.info('[pnpm/full-test] Running tests across ALL apps…');
      await testAll();
      logger.success('[pnpm/full-test] All tests finished.');
    },
    'full-lint': async () => {
      logger.info('[pnpm/full-lint] Running lint across ALL apps…');
      await lintAll();
      logger.success('[pnpm/full-lint] Lint finished.');
    },
    'pre-install': async () => {
      logger.info('[pnpm/pre-install] Switching root workspaces to Yarn-only…');
      await yarnPreInstall();
      logger.success('[pnpm/pre-install] Root workspaces set to Yarn-only.');
    },
    'post-install': async () => {
      logger.info('[pnpm/post-install] Bootstrap PNPM, build+link privates, install PNPM apps, restore merged workspaces…');
      await yarnPostInstall();
      logger.success('[pnpm/post-install] PNPM ready; PNPM apps installed; workspaces restored.');
    }
  }
};

const supportedTypes = Object.keys(packageManagers);

program
  .name('manager-pm')
  .description('manager-pm — Hybrid Yarn + PNPM orchestration for incremental adoption')
  .version('0.1.0')
  .usage('--type pnpm --action <action> [--app <name-or-path>]')
  .showHelpAfterError(true);

program
  .option('--type <type>', `package manager type (${supportedTypes.join(', ')})`, supportedTypes[0])
  .option('--action <name>', `action (${Object.keys(actions).join('|')})`)
  .option('--app <name>', 'Target app name/path (required for app-specific actions)')
  .option('--region <region>', 'Region to start app in (default: EU)', 'EU')
  .option('--container', 'Run inside container', false);

program.parse(process.argv);
const opts = program.opts();

logger.info(`manager-pm v${program.opts().version || '0.1.0'}
type: ${opts.type}
action: ${opts.action || '(none)'}
app: ${opts.app || '(none)'}
region: ${opts.region}
container: ${opts.container}`);

(async () => {
  if (!opts.action) program.help();

  const impl = packageManagers[opts.type]?.[opts.action];
  if (!impl) {
    logger.error(`❌ Action "${opts.action}" not supported for package manager "${opts.type}".`);
    process.exit(1);
  }
  if (actions[opts.action]?.needsApp && !opts.app) {
    logger.error(`❌ Action "${opts.action}" requires --app <name|path>.`);
    process.exit(1);
  }

  if (opts.action === 'start') {
    await impl(opts.app, { region: opts.region, container: opts.container });
  } else {
    await impl(opts.app);
  }
  process.exit(0);
})();
