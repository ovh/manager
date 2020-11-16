#!/usr/bin/env node

const path = require('path');
const program = require('commander');
const pkg = require('../package.json');

const devServer = require('../src/dev');

const collectFragment = (fragment, fragments) => [...fragments, fragment];

program
  .version(pkg.version)
  .arguments('<fragmentsPath>')
  .option('-p, --port <port>', 'server port', 8888)
  .option(
    '-e, --regexp <pattern>',
    'filter fragment pattern',
    collectFragment,
    [],
  )
  .option(
    '--fallbackRegistry <fallbackRegistry>',
    'Fallback server registry url',
  )
  .action((fragmentsPath, cmd) => {
    devServer(path.resolve(fragmentsPath), cmd.port, {
      fallbackRegistry: cmd.fallbackRegistry,
      filters: cmd.regexp,
    });
  })
  .parse(process.argv);
