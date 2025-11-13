#!/usr/bin/env node
import chalk from 'chalk';

import { forgeComponentCli } from '../dist/src/manager-forge-component.js';

async function main() {
  try {
    await forgeComponentCli(process.argv.slice(2));
  } catch (error) {
    console.error(chalk.red(error instanceof Error ? error.message : String(error)));
    process.exit(1);
  }
}

main();
