#!/usr/bin/env node
import chalk from 'chalk';

import { logger } from '@ovh-ux/manager-cli-core/logger';

import { HELP_API } from '../dist/src/configs/manager-forge-help-config.js';
import { runForgeCli } from '../dist/src/helpers/manager-forge-cli-helper.js';
import { forgeApiCli } from '../dist/src/manager-forge-api.js';

async function main() {
  try {
    await runForgeCli(
      () => forgeApiCli(process.argv.slice(2)),
      {
        clearScreen: false,
        showBanner: false,
        showSpinner: false,
      },
      HELP_API,
    );
  } catch (error) {
    logger.error(chalk.red(error instanceof Error ? error.message : String(error)));
    process.exit(1);
  }
}

main();
