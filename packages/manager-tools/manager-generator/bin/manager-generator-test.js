#!/usr/bin/env node
/* eslint-disable no-undef */
/* manager-generator-test.js
 * A lightweight CLI test runner for manager-generator.
 * - Reads scenarios from ./scenarios/manager-generator-scenarios.json
 * - Runs each command in a shell (so $(mktemp -d) works)
 * - Validates exit code and output using includes/regex
 * Usage: node bin/manager-generator-test.js [--filter "<substring>"] [--timeout 60000] [--bail]
 */
import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ANSI = {
  reset: '\x1b[0m',
  gray: '\x1b[90m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

function logInfo(msg) {
  console.log(ANSI.cyan + 'ℹ︎ ' + ANSI.reset + msg);
}

function logPass(msg) {
  console.log(ANSI.green + '✓ ' + ANSI.reset + msg);
}

function logFail(msg) {
  console.error(ANSI.red + '✗ ' + ANSI.reset + msg);
}

function parseArgs(argv) {
  const args = { filter: '', timeout: 60000, bail: false };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--filter') {
      args.filter = argv[++i] || '';
    } else if (a === '--timeout') {
      args.timeout = Number(argv[++i] || '60000');
    } else if (a === '--bail') {
      args.bail = true;
    }
  }
  return args;
}

function substituteTokens(cmd, tmp) {
  // Replace {TMP} and {OUT} tokens with tmp path
  return cmd.replace(/\{TMP\}|\{OUT\}/g, tmp);
}

async function runScenario(s, timeout) {
  return new Promise((resolve) => {
    const tmp = mkdtempSync(join(tmpdir(), 'mgr-gen-'));
    const cmd = substituteTokens(s.cmd, tmp);
    const child = spawn(cmd, { shell: true, env: process.env });

    let stdout = '',
      stderr = '';
    const timer = setTimeout(() => {
      try {
        child.kill('SIGKILL');
      } catch {
        /* empty */
      }
    }, timeout);

    child.stdout.on('data', (d) => (stdout += d.toString()));
    child.stderr.on('data', (d) => (stderr += d.toString()));

    child.on('close', (code) => {
      clearTimeout(timer);
      const result = { name: s.name, code, stdout, stderr, tmp };
      // Write artifacts for debugging
      try {
        writeFileSync(join(tmp, 'stdout.log'), stdout);
        writeFileSync(join(tmp, 'stderr.log'), stderr);
      } catch {
        /* empty */
      }
      resolve(result);
    });
  });
}

function checkExpectations(s, r) {
  const errs = [];
  if (typeof s.expectExit === 'number' && s.expectExit !== r.code) {
    errs.push(`expected exit ${s.expectExit}, got ${r.code}`);
  }
  const inc = (arr, hay, label) => {
    for (const needle of arr || []) {
      if (!hay.includes(needle)) {
        errs.push(`${label} does not include: ${JSON.stringify(needle)}`);
      }
    }
  };
  inc(s.expectStdoutIncludes, r.stdout, 'stdout');
  inc(s.expectStderrIncludes, r.stderr, 'stderr');

  const rex = (arr, hay, label) => {
    for (const pattern of arr || []) {
      const re = new RegExp(pattern, 'mis');
      if (!re.test(hay)) {
        errs.push(`${label} does not match /${pattern}/`);
      }
    }
  };
  rex(s.expectStdoutRegex, r.stdout, 'stdout');
  rex(s.expectStderrRegex, r.stderr, 'stderr');

  // Negative matches
  const notRex = (arr, hay, label) => {
    for (const pattern of arr || []) {
      const re = new RegExp(pattern, 'mis');
      if (re.test(hay)) {
        errs.push(`${label} unexpectedly matched /${pattern}/`);
      }
    }
  };
  notRex(s.forbidStdoutRegex, r.stdout, 'stdout');
  notRex(s.forbidStderrRegex, r.stderr, 'stderr');

  return errs;
}

(async function main() {
  const args = parseArgs(process.argv);
  const scenariosPath = join(__dirname, '.', 'scenarios', 'manager-generator-scenarios.json');
  if (!existsSync(scenariosPath)) {
    console.error('Scenarios file not found: ' + scenariosPath);
    process.exit(2);
  }
  const scenarios = JSON.parse(readFileSync(scenariosPath, 'utf8'));

  const filtered = scenarios.filter((s) => !args.filter || s.name.includes(args.filter));
  if (filtered.length === 0) {
    console.error('No scenarios matched the filter.');
    process.exit(2);
  }

  logInfo(
    `Running ${filtered.length} scenario(s)${args.filter ? ` (filter: ${args.filter})` : ''}...`,
  );
  let passed = 0,
    failed = 0;
  for (const s of filtered) {
    logInfo(`Scenario: ${s.name}`);
    const r = await runScenario(s, args.timeout);
    const errs = checkExpectations(s, r);
    if (errs.length === 0) {
      logPass(`${s.name} (exit ${r.code})`);
      passed++;
    } else {
      logFail(`${s.name} failed:`);
      for (const e of errs) console.error('  - ' + e);
      console.error(ANSI.gray + '---- stdout ----\n' + r.stdout + ANSI.reset);
      console.error(ANSI.gray + '---- stderr ----\n' + r.stderr + ANSI.reset);
      failed++;
      if (args.bail) break;
    }
  }
  console.log('');
  if (failed === 0) {
    console.log(ANSI.bold + ANSI.green + `✔ All ${passed} scenario(s) passed.` + ANSI.reset);
    process.exit(0);
  } else {
    console.error(
      ANSI.bold + ANSI.red + `✘ ${failed} scenario(s) failed, ${passed} passed.` + ANSI.reset,
    );
    process.exit(1);
  }
})();
