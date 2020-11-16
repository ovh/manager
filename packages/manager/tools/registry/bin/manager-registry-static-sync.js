#!/usr/bin/env node

const path = require('path');
const program = require('commander');
const pkg = require('../package.json');

const syncStaticRegistry = require('../src/syncStaticRegistry');

program
  .version(pkg.version)
  .arguments('<sourceRegistryPath> <targetRegistryPath>')
  .action((sourceRegistryPath, targetRegistryPath) => {
    syncStaticRegistry(
      path.resolve(sourceRegistryPath),
      path.resolve(targetRegistryPath),
    );
  })
  .parse(process.argv);
