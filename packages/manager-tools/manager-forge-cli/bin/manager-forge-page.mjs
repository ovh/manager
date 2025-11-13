#!/usr/bin/env node
import chalk from 'chalk';

import { forgePageCli } from '../dist/src/manager-forge-page.js';

async function main() {
  try {
    await forgePageCli(process.argv.slice(2));
  } catch (error) {
    console.error(chalk.red(error instanceof Error ? error.message : String(error)));
    process.exit(1);
  }
}

main();
