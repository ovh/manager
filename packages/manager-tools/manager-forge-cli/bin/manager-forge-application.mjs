#!/usr/bin/env node
import chalk from 'chalk';

import { forgeApplicationCli } from '../dist/src/manager-forge-application.js';
import { askApplicationInfos } from '../dist/src/manager-forge-prompts.js';

async function main() {
  try {
    const answers = await askApplicationInfos();
    await forgeApplicationCli(answers);
  } catch (error) {
    console.error(chalk.red(error instanceof Error ? error.message : String(error)));
    process.exit(1);
  }
}

main();
