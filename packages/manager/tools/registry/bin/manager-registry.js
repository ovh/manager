#!/usr/bin/env node

const program = require('commander');
const pkg = require('../package.json');

program
  .version(pkg.version)
  .command('dev <fragmentsPath>', 'Dev server for local fragments')
  .parse(process.argv);
