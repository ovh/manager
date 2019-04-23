const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const rollup = require('rollup');

const log = console.log; // eslint-disable-line

let cache;

const configPath = path.join(process.cwd(), './rollup.config.js');
if (!fs.existsSync(configPath)) {
  log(chalk.bgRed.black(' ERROR '), chalk.red('No configuration file found'));
  return;
}

// see below for details on the options
const config = require(configPath)[0]; // eslint-disable-line

const watcher = rollup.watch({
  ...config,
  cache,
});

watcher.on('event', (event) => {
  switch (event.code) {
    case 'START':
      console.clear();
      log(chalk.bgBlue.black(' INFO '), chalk.blue('Starting...'));
      break;
    case 'BUNDLE_START':
      console.clear();
      log(chalk.bgBlue.black(' INFO '), chalk.blue('Building...'));
      break;
    case 'BUNDLE_END':
      console.clear();
      log(chalk.bgGreen.black(' DONE '), chalk.green(`Compiled successfully in ${event.duration}ms`));
      break;
    case 'END':
      break;
    case 'ERROR':
      console.clear();
      log(chalk.bgRed.black(' ERROR '), chalk.red(event.error));
      break;
    default:
      log('unknown event', event);
  }
});
