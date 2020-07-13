#!/usr/bin/env node

const program = require('commander');
const pkg = require('../package.json');
const { defaultConfig, devServer } = require('../src');

program
  .version(pkg.version)
  .usage('<path>')
  .option(
    '-r, --region <region>',
    'Region (EU|CA|US)',
    process.env.REGION || defaultConfig.region,
  )
  .option(
    '-p, --port <port>',
    'server port',
    process.env.PORT || defaultConfig.port,
  )
  .option(
    '--local2API',
    'Use local2API proxy (localhost:8080)',
    process.env.local2API || false,
  )
  .option(
    '--localRegistry',
    'Use localRegistry proxy (localhost:8888)',
    process.env.local2API || false,
  )
  .option(
    '--registryUrl <registryUrl>',
    'Add registry proxy to registryUrl',
    process.env.registryUrl,
  )
  .parse(process.argv);

if (program.args.length === 0) {
  program.outputHelp();
  process.exit();
}

const [path] = program.args;
devServer(path, program.region, program.port, {
  local2API: program.local2API,
  localRegistry: program.localRegistry,
  registryUrl: program.registryUrl,
});
