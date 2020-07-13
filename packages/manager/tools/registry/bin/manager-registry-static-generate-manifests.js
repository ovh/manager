#!/usr/bin/env node

const path = require('path');
const program = require('commander');
const pkg = require('../package.json');

const generateManifests = require('../src/generateManifests');

program
  .version(pkg.version)
  .arguments('<registryPath>')
  .action((registryPath) => {
    generateManifests(path.resolve(registryPath));
  })
  .parse(process.argv);
