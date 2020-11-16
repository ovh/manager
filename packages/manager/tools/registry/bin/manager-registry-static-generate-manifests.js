#!/usr/bin/env node

const path = require('path');
const program = require('commander');
const pkg = require('../package.json');

const generateManifests = require('../src/generateManifests');

program
  .version(pkg.version)
  .arguments('<registryPath>')
  .option(
    '--fallbackRegistry <fallbackRegistry>',
    'Fallback server registry url',
  )
  .action((registryPath, cmd) => {
    generateManifests(path.resolve(registryPath), {
      fallbackRegistry: cmd.fallbackRegistry,
    });
  })
  .parse(process.argv);
