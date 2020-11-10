#!/usr/bin/env node

const path = require('path');
const program = require('commander');
const pkg = require('../package.json');
const { generateManifest } = require('../src');

program
  .version(pkg.version)
  .arguments('<basePath>')
  .option('--application <application>', 'application name', 'application')
  .option('-f, --file <filename>', 'manifest file name', 'manifest.json')
  .option('--verbose', 'output extra debugging')
  .action(async (basePath, cmd) => {
    const manifest = await generateManifest(path.resolve(basePath), {
      manifestFileName: cmd.file,
      name: cmd.application,
    });

    if (cmd.verbose) {
      // eslint-disable-next-line no-console
      console.log(manifest);
    }
  })
  .parse(process.argv);
