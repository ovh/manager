#!/usr/bin/env node

const path = require('path');
const program = require('commander');
const pkg = require('../package.json');

const devServer = require('../src/dev');

program
  .version(pkg.version)
  .arguments('<fragmentsPath>')
  .option('-p, --port <port>', 'server port', 8888)
  .action((fragmentsPath, cmd) => {
    devServer(path.resolve(fragmentsPath), cmd.port);
  })
  .parse(process.argv);
