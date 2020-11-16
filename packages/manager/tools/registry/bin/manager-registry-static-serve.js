#!/usr/bin/env node

const path = require('path');
const program = require('commander');
const pkg = require('../package.json');

const serveStatic = require('../src/serveStatic');

program
  .version(pkg.version)
  .arguments('<registryPath>')
  .option('-p, --port <port>', 'server port', 8888)
  .action((registryPath, cmd) => {
    serveStatic(path.resolve(registryPath), cmd.port);
  })
  .parse(process.argv);
