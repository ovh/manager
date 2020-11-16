#!/usr/bin/env node

const program = require('commander');
const pkg = require('../package.json');

program
  .version(pkg.version)
  .command(
    'generate-manifests <registryPath>',
    'Generate manifest for static registry',
  )
  .command('serve <registryPath>', 'Serve a static registry')
  .command(
    'add <registryPath> <fragmentPath>',
    'Add a fragment in static registry',
  )
  .command(
    'sync <sourceRegistryPath> <targetRegistryPath>',
    'Sync two registry directories',
  )
  .parse(process.argv);
