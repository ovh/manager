#!/usr/bin/env node
import chalk from 'chalk';

import { forgeHookCli } from '../dist/src/manager-forge-hook.js';

async function main() {
  try {
    await forgeHookCli(process.argv.slice(2));
  } catch (error) {
    console.error(chalk.red(error instanceof Error ? error.message : String(error)));
    process.exit(1);
  }
}

main();
