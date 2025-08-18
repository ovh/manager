#!/usr/bin/env node
// eslint-disable-next-line import/no-extraneous-dependencies
import { program } from 'commander';
import { consola } from 'consola';

/**
 * Dictionary of all supported actions across package managers.
 *
 * Keys: canonical action names
 * Values: human-readable descriptions (used in CLI help).
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
 * Dictionary of package manager implementations.
 */
const packageManagers = {
  pnpm: {
    bootstrap: () =>
      consola.info(`[pnpm] bootstrap → This will install the pnpm binary.`),
    add: (app) =>
      consola.info(
        `[pnpm] add → This will add app "${app}" to the pnpm workflow.`,
      ),
    remove: (app) =>
      consola.info(
        `[pnpm] remove → This will remove app "${app}" from the pnpm workflow.`,
      ),
    install: (app) =>
      consola.info(
        `[pnpm] install → This will install dependencies for app "${app}".`,
      ),
    build: (app) =>
      consola.info(`[pnpm] build → This will build app "${app}".`),
    test: (app) =>
      consola.info(`[pnpm] test → This will run tests for app "${app}".`),
    start: (app) =>
      consola.info(`[pnpm] start → This will start app "${app}".`),
    help: () => program.help(),
  },
};

/**
 * Supported package manager types.
 */
const supportedTypes = Object.keys(packageManagers);

// -----------------------------
// Special-case: handle --list before parsing
// -----------------------------
if (process.argv.includes('--list')) {
  consola.info(
    `[global] list → This will list all apps managed across package managers.`,
  );
  process.exit(0);
}

// -----------------------------
// CLI setup
// -----------------------------
program
  .name('manager-pm')
  .description('Manager Package Manager CLI (incremental pnpm adoption)')
  .version('0.1.0');

/**
 * Global options
 */
program
  .option(
    '--type <type>',
    `package manager type (${supportedTypes.join(', ')})`,
    supportedTypes[0],
  )
  .option('--action <name>', `action (${Object.keys(actions).join('|')})`)
  .option(
    '--app <name>',
    'Target app name (required for app-specific actions)',
  );

// -----------------------------
// Parse args and dispatch action
// -----------------------------
program.parse(process.argv);

const opts = program.opts();

if (opts.action) {
  const handler = packageManagers[opts.type]?.[opts.action];
  if (!handler) {
    consola.error(
      `Action "${opts.action}" not supported for package manager "${opts.type}".`,
    );
    process.exit(1);
  }

  // Actions like add/remove/build/test/start need an app
  if (
    ['add', 'remove', 'install', 'build', 'test', 'start'].includes(
      opts.action,
    ) &&
    !opts.app
  ) {
    consola.error(`Action "${opts.action}" requires --app <name>.`);
    process.exit(1);
  }

  handler(opts.app);
  process.exit(0);
}

// If no action/list provided, show help
program.help();
