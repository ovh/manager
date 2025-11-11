#!/usr/bin/env node
import chalk from 'chalk';

import {
  displayAppGenerationSummary,
  renderBanner,
  showInitializationSpinner,
} from '../dist/src/helpers/manager-forge-cli-helper.js';
import { forgeApplication } from '../dist/src/manager-forge-application.js';
import { askApplicationInfos } from '../dist/src/manager-forge-prompts.js';

async function main() {
  console.clear();
  renderBanner();

  await showInitializationSpinner();

  try {
    console.log('\n');
    const answers = await askApplicationInfos();
    displayAppGenerationSummary(answers);
    forgeApplication(answers);
  } catch (error) {
    console.error(chalk.red(error instanceof Error ? error.message : String(error)));
    process.exit(1);
  }
}

main();
