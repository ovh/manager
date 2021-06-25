#!/usr/bin/env node

const program = require('commander');
const moment = require('moment');

const pkg = require('../package.json');

const Codename = require('../src/codename');
const data = require('../data/sample');

program
  .version(pkg.version)
  .option('-s, --seed <seed>', 'random seed', 'RockPaperScissor')
  .option('-d, --date <date>', 'date to encode', moment().format('Y-MM-DD'))
  .option('-v, --verbose', 'verbose', false)
  .action(() => {
    const { date, seed, verbose } = program.opts();

    if (verbose) {
      console.log('📅  date : ', date);
      console.log('🎲  seed : ', seed);
    }
    const encoder = new Codename(data, seed);
    console.log(encoder.encode(date));
  })
  .parse(process.argv);
