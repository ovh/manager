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
  .parse(process.argv);
