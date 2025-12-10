#!/usr/bin/env node
import chalk from 'chalk';

import { logger } from '@ovh-ux/manager-cli-core/logger';

import { HELP_APPLICATION } from '../dist/src/configs/manager-forge-help-config.js';
import { runForgeCli } from '../dist/src/helpers/manager-forge-cli-helper.js';
import { askApplicationInfos } from '../dist/src/helpers/manager-forge-prompts-helper.js';
import { forgeApplicationCli } from '../dist/src/manager-forge-application.js';

async function main() {
  try {
    await runForgeCli(
      async () => {
        const answers = await askApplicationInfos();
        await forgeApplicationCli(answers);
      },
      {
        clearScreen: true,
        showBanner: true,
        showSpinner: true,
      },
      HELP_APPLICATION,
    );
  } catch (error) {
    logger.error(chalk.red(error instanceof Error ? error.message : String(error)));
    process.exit(1);
  }
}

main();
