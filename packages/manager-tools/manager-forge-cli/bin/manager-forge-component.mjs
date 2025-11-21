#!/usr/bin/env node
import chalk from 'chalk';

import { HELP_COMPONENT } from '../dist/src/configs/manager-forge-help-config.js';
import { runForgeCli } from '../dist/src/helpers/manager-forge-cli-helper.js';
import { forgeComponentCli } from '../dist/src/manager-forge-component.js';
import { logger } from '../dist/src/utils/log-manager.js';

async function main() {
  try {
    await runForgeCli(
      () => forgeComponentCli(process.argv.slice(2)),
      {
        clearScreen: false,
        showBanner: false,
        showSpinner: false,
      },
      HELP_COMPONENT,
    );
  } catch (error) {
    logger.error(chalk.red(error instanceof Error ? error.message : String(error)));
    process.exit(1);
  }
}

main();
