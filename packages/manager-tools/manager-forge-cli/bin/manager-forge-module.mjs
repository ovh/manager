#!/usr/bin/env node
import chalk from 'chalk';

import { HELP_MODULE } from '../dist/src/configs/manager-forge-help-config.js';
import { runForgeCli } from '../dist/src/helpers/manager-forge-cli-helper.js';
import { askModuleInfos } from '../dist/src/helpers/manager-forge-prompts-helper.js';
import { forgeModuleCli } from '../dist/src/manager-forge-module.js';
import { logger } from '../dist/src/utils/log-manager.js';

async function main() {
  try {
    await runForgeCli(
      async () => {
        const answers = await askModuleInfos();
        await forgeModuleCli(answers);
      },
      {
        clearScreen: true,
        showBanner: true,
        showSpinner: true,
      },
      HELP_MODULE,
    );
  } catch (error) {
    logger.error(chalk.red(error instanceof Error ? error.message : String(error)));
    process.exit(1);
  }
}

main();
