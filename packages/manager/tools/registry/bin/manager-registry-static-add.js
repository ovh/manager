#!/usr/bin/env node

const path = require('path');
const program = require('commander');
const pkg = require('../package.json');

const staticAddFragment = require('../src/addFragmentStatic');

program
  .version(pkg.version)
  .arguments('<registryPath> <fragmentPath>')
  .action((registryPath, fragmentPath) => {
    staticAddFragment(path.resolve(registryPath), path.resolve(fragmentPath));
  })
  .parse(process.argv);
