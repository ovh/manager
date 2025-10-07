#!/usr/bin/env node
import process from 'node:process';

import { checkComponents } from './commands/check-components.js';
import { checkVersions } from './commands/check-versions.js';
import { updateOdsVersions } from './commands/update-versions.js';
import { logger } from './utils/log-manager.js';

const args = process.argv.slice(2);

async function main() {
  if (args.includes('--check-versions')) {
    await checkVersions();
  } else if (args.includes('--check-components')) {
    await checkComponents();
  } else if (args.includes('--update-version')) {
    await updateOdsVersions({ withInstall: true });
  } else {
    logger.warn('Usage: manager-muk-cli --check-versions | --check-components | --update');
  }
}

main().catch((err) => {
  logger.error(`CLI error: ${err.message}`);
  process.exit(1);
});
