#!/usr/bin/env node
/* eslint-disable no-undef */
/**
 * @file manager-generator-test.js
 * @description CLI test runner for `manager-generator` with optional verbose diagnostics.
 *
 * It reads scenarios from `./scenarios/manager-generator-scenarios.json`,
 * runs each command in a real shell (so things like `$(mktemp -d)` work),
 * and validates exit code and output using substring or regex checks.
 *
 * ## Usage
 *   node bin/manager-generator-test.js [--filter "<substring>"] [--timeout 60000] [--bail] [--verbose]
 *
 * ## Options
 *   --filter   Only run scenarios whose `name` contains this substring.
 *   --timeout  Per-scenario timeout in ms (default: 60000).
 *   --bail     Stop after the first failure.
 *   --verbose  Print extra debug info, including scenario JSON and stdout/stderr for passes.
 */
import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {Readonly<Record<string,string>>} */
const ANSI = Object.freeze({
  reset: '\x1b[0m',
  gray: '\x1b[90m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
});

/**
 * Scenario definition loaded from JSON.
 * @typedef {Object} Scenario
 * @property {string} name                          - Human-readable scenario name.
 * @property {string} cmd                           - Shell command to execute. `{TMP}` or `{OUT}` will be replaced by a temp dir.
 * @property {number=} expectExit                   - Expected exit code.
 * @property {string[]=} expectStdoutIncludes       - Substrings that must appear in stdout.
 * @property {string[]=} expectStderrIncludes       - Substrings that must appear in stderr.
 * @property {string[]=} expectStdoutRegex          - Regex patterns that must match stdout (flags: m i s).
 * @property {string[]=} expectStderrRegex          - Regex patterns that must match stderr (flags: m i s).
 * @property {string[]=} forbidStdoutRegex          - Regex patterns that must NOT match stdout.
 * @property {string[]=} forbidStderrRegex          - Regex patterns that must NOT match stderr.
 */

/**
 * Parsed CLI arguments.
 * @typedef {Object} Args
 * @property {string}  filter   - Name substring to filter scenarios.
 * @property {number}  timeout  - Per-scenario timeout in ms.
 * @property {boolean} bail     - Stop on first failure.
 * @property {boolean} verbose  - Verbose output.
 */

/**
 * Result of a single scenario run.
 * @typedef {Object} ScenarioResult
 * @property {string} name      - Scenario name.
 * @property {number} code      - Exit code.
 * @property {string} stdout    - Captured stdout.
 * @property {string} stderr    - Captured stderr.
 * @property {string} tmp       - Temporary directory used for this run.
 */

/** @param {string} msg */
function logInfo(msg) {
  console.log(ANSI.cyan + 'ℹ︎ ' + ANSI.reset + msg);
}
/** @param {string} msg */
function logPass(msg) {
  console.log(ANSI.green + '✓ ' + ANSI.reset + msg);
}
/** @param {string} msg */
function logFail(msg) {
  console.error(ANSI.red + '✗ ' + ANSI.reset + msg);
}

/**
 * Safely parse a number, falling back to a default.
 * @param {string|undefined} raw
 * @param {number} fallback
 * @returns {number}
 */
function toNumber(raw, fallback) {
  const n = Number(raw);
  return Number.isFinite(n) ? n : fallback;
}

/**
 * Parse CLI arguments.
 * @param {string[]} argv
 * @returns {Args}
 */
function parseArgs(argv) {
  /** @type {Args} */
  const args = { filter: '', timeout: 60000, bail: false, verbose: false };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--filter') args.filter = argv[++i] || '';
    else if (a === '--timeout') args.timeout = toNumber(argv[++i], 60000);
    else if (a === '--bail') args.bail = true;
    else if (a === '--verbose') args.verbose = true;
  }
  return args;
}

/**
 * Replace `{TMP}` or `{OUT}` placeholders with the temp directory.
 * @param {string} cmd
 * @param {string} tmp
 * @returns {string}
 */
function substituteTokens(cmd, tmp) {
  return cmd.replace(/\{TMP\}|\{OUT\}/g, tmp);
}

/**
 * Execute a scenario command and capture output.
 * @param {Scenario} s
 * @param {number} timeout
 * @param {boolean} verbose
 * @returns {Promise<ScenarioResult>}
 */
async function runScenario(s, timeout, verbose) {
  return new Promise((resolve) => {
    const tmp = mkdtempSync(join(tmpdir(), 'mgr-gen-'));
    const cmd = substituteTokens(s.cmd, tmp);

    if (verbose) {
      logInfo(`Temp dir: ${tmp}`);
      logInfo(`Command: ${cmd}`);
      logInfo(`Scenario definition:\n${JSON.stringify(s, null, 2)}`);
    }

    const child = spawn(cmd, { shell: true, env: process.env });

    let stdout = '';
    let stderr = '';

    const timer = setTimeout(() => {
      try {
        child.kill('SIGKILL');
      } catch {
        /* ignore */
      }
    }, timeout);

    child.stdout.on('data', (d) => (stdout += d.toString()));
    child.stderr.on('data', (d) => (stderr += d.toString()));

    child.on('close', (code) => {
      clearTimeout(timer);
      /** @type {ScenarioResult} */
      const result = { name: s.name, code, stdout, stderr, tmp };
      // Persist artifacts for debugging
      try {
        writeFileSync(join(tmp, 'stdout.log'), stdout);
        writeFileSync(join(tmp, 'stderr.log'), stderr);
      } catch {
        /* ignore */
      }
      resolve(result);
    });
  });
}

/**
 * Validate outputs of a scenario run against expectations.
 * @param {Scenario} s
 * @param {ScenarioResult} r
 * @param {boolean} verbose
 * @returns {string[]} Array of error messages (empty if OK).
 */
function checkExpectations(s, r, verbose) {
  const errs = [];

  if (typeof s.expectExit === 'number' && s.expectExit !== r.code) {
    errs.push(`expected exit ${s.expectExit}, got ${r.code}`);
  }

  /**
   * Ensure each string in `arr` is a substring of `hay`.
   * @param {string[]=} arr
   * @param {string} hay
   * @param {'stdout'|'stderr'} label
   */
  const inc = (arr, hay, label) => {
    for (const needle of arr || []) {
      if (!hay.includes(needle)) {
        errs.push(`${label} does not include: ${JSON.stringify(needle)}`);
        if (verbose) {
          console.error(ANSI.yellow + `  → Missing substring: ${needle}` + ANSI.reset);
        }
      }
    }
  };

  inc(s.expectStdoutIncludes, r.stdout, 'stdout');
  inc(s.expectStderrIncludes, r.stderr, 'stderr');

  /**
   * Ensure each regex pattern in `arr` matches `hay`.
   * @param {string[]=} arr
   * @param {string} hay
   * @param {'stdout'|'stderr'} label
   */
  const rex = (arr, hay, label) => {
    for (const pattern of arr || []) {
      const re = new RegExp(pattern, 'mis');
      if (!re.test(hay)) {
        errs.push(`${label} does not match /${pattern}/`);
        if (verbose) {
          console.error(ANSI.yellow + `  → Pattern not matched: ${pattern}` + ANSI.reset);
        }
      }
    }
  };

  rex(s.expectStdoutRegex, r.stdout, 'stdout');
  rex(s.expectStderrRegex, r.stderr, 'stderr');

  /**
   * Ensure each negative regex pattern in `arr` does NOT match `hay`.
   * @param {string[]=} arr
   * @param {string} hay
   * @param {'stdout'|'stderr'} label
   */
  const notRex = (arr, hay, label) => {
    for (const pattern of arr || []) {
      const re = new RegExp(pattern, 'mis');
      if (re.test(hay)) {
        errs.push(`${label} unexpectedly matched /${pattern}/`);
        if (verbose) {
          console.error(ANSI.yellow + `  → Unexpected match: ${pattern}` + ANSI.reset);
        }
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

  /** @type {Scenario[]} */
  const scenarios = JSON.parse(readFileSync(scenariosPath, 'utf8'));
  const filtered = scenarios.filter((s) => !args.filter || s.name.includes(args.filter));

  if (filtered.length === 0) {
    console.error('No scenarios matched the filter.');
    process.exit(2);
  }

  logInfo(
    `Running ${filtered.length} scenario(s)${args.filter ? ` (filter: ${args.filter})` : ''}...`,
  );

  let passed = 0;
  let failed = 0;

  for (const s of filtered) {
    logInfo(`Scenario: ${s.name}`);

    const r = await runScenario(s, args.timeout, args.verbose);
    const errs = checkExpectations(s, r, args.verbose);

    if (errs.length === 0) {
      logPass(`${s.name} (exit ${r.code})`);
      if (args.verbose) {
        console.log(ANSI.gray + '---- stdout ----\n' + r.stdout + ANSI.reset);
        console.log(ANSI.gray + '---- stderr ----\n' + r.stderr + ANSI.reset);
      }
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
