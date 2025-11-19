#!/usr/bin/env node
import chalk from 'chalk';

import { HELP_PAGE } from '../dist/src/configs/manager-forge-help-config.js';
import { runForgeCli } from '../dist/src/helpers/manager-forge-cli-helper.js';
import { forgePageCli } from '../dist/src/manager-forge-page.js';
import { logger } from '../dist/src/utils/log-manager.js';

async function main() {
  try {
    await runForgeCli(
      () => forgePageCli(process.argv.slice(2)),
      {
        clearScreen: false,
        showBanner: false,
        showSpinner: false,
      },
      HELP_PAGE,
    );
  } catch (error) {
    logger.error(chalk.red(error instanceof Error ? error.message : String(error)));
    process.exit(1);
  }
}

main();
