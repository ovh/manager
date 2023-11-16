#!/usr/bin/env node
import minimist from 'minimist';
import { Plop, run } from 'plop';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const argv = minimist(args);

const appDirectory = dirname(fileURLToPath(import.meta.url));

Plop.prepare(
  {
    cwd: argv.cwd,
    configPath: join(appDirectory, 'plopfile.js'),
    preload: argv.preload || [],
    completion: argv.completion,
  },
  (env) => Plop.execute(env, run),
);
