#!/usr/bin/env node
import chalk from 'chalk';

import { HELP_APPLICATION } from '../dist/src/configs/manager-forge-config.js';
import { runForgeCli } from '../dist/src/helpers/manager-forge-cli-helper.js';
import { forgeApplicationCli } from '../dist/src/manager-forge-application.js';
import { askApplicationInfos } from '../dist/src/manager-forge-prompts.js';

async function main() {
  try {
    await runForgeCli(
      async () => {
        const answers = await askApplicationInfos(); // prompt AFTER banner+spinner
        await forgeApplicationCli(answers); // no banner here anymore
      },
      {
        clearScreen: true,
        showBanner: true,
        showSpinner: true,
      },
      HELP_APPLICATION,
    );
  } catch (error) {
    console.error(chalk.red(error instanceof Error ? error.message : String(error)));
    process.exit(1);
  }
}

main();
