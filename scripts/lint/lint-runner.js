#!/usr/bin/env node

/* eslint-disable */

const { spawn, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Parses CLI arguments to extract app-related flags.
 */
const appArgIndex = process.argv.indexOf('--app');
const fix = process.argv.includes('--fix');
const verbose = !process.argv.includes('--quiet');

const appValue = appArgIndex !== -1 ? process.argv[appArgIndex + 1] : null;
const isPackageName = appValue?.startsWith('@');
const appName = isPackageName ? null : appValue;
const packageName = isPackageName ? appValue : null;

const appsRoot = path.join(__dirname, '../../packages/manager/apps');
const allApps = fs
  .readdirSync(appsRoot)
  .filter((dir) => fs.statSync(path.join(appsRoot, dir)).isDirectory());

/**
 * Filters apps that use the static analysis kit with a modern ESLint config.
 */
const modernApps = allApps.filter((app) => {
  const appPath = path.join(appsRoot, app);
  const configExists = fs.existsSync(path.join(appPath, 'eslint.config.mjs'));
  const pkgPath = path.join(appPath, 'package.json');

  if (!configExists || !fs.existsSync(pkgPath)) return false;

  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    return pkg.scripts && pkg.scripts['lint:modern'];
  } catch (err) {
    if (verbose) console.error(`🔴 Error reading package.json in ${app}:`, err);
    return false;
  }
});

/**
 * Lint ignore patterns for modern apps if not targeting a single one.
 */
const ignorePatterns =
  appName || isPackageName
    ? []
    : modernApps.map(
      (app) => `--ignore-pattern='packages/manager/apps/${app}/**'`,
    );

/**
 * Determines legacy lint targets.
 */
const legacyPattern = appName
  ? [`packages/manager/apps/${appName}/**/*.{tsx,ts}`]
  : [
    'packages/manager/apps/**/*.{tsx,ts}',
    'packages/manager-react-components/**/*.{tsx,ts}',
  ];

if (verbose) {
  console.log(`🗂️ Legacy lint patterns:\n${legacyPattern.join('\n')}`);
  if (ignorePatterns.length > 0) {
    console.log(`🚫 Ignored modern apps:\n${ignorePatterns.join('\n')}`);
  }
}

const tasks = [];

if (!isPackageName) {
  tasks.push({
    name: appName ? `legacy lint:tsx (${appName})` : 'legacy lint:tsx',
    cmd: [
      'eslint',
      ...(fix ? ['--fix'] : []),
      '--quiet',
      ...legacyPattern,
      ...ignorePatterns,
    ],
  });
}

const turboTask = fix ? 'lint:modern:fix' : 'lint:modern';

tasks.push({
  name: `modern ${turboTask} (Turbo)`,
  cmd: isPackageName
    ? ['turbo', 'run', turboTask, '--filter', packageName]
    : appName
      ? ['turbo', 'run', turboTask, '--filter', appName]
      : ['turbo', 'run', turboTask],
});

const errors = [];

/**
 * Spawns a command as a child process and returns output.
 * @param {string} command
 * @param {string[]} args
 * @returns {Promise<string>}
 */
async function run(command, args) {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, {
      shell: true,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', (data) => {
      const str = data.toString();
      stdout += str;
      if (verbose) process.stdout.write(str);
    });

    proc.stderr.on('data', (data) => {
      const str = data.toString();
      stderr += str;
      if (verbose) process.stderr.write(str);
    });

    proc.on('close', (code) => {
      if (verbose) console.log(`⏹ Exit code: ${code}`);
      if (code !== 0) {
        reject({ code, message: stdout + stderr });
      } else {
        resolve(stdout);
      }
    });

    proc.on('error', (err) => {
      reject({ code: 1, message: err.message || 'Unknown process error' });
    });
  });
}

/**
 * Collects error messages from failed lint/build tasks.
 * @param {object} task
 * @param {object} err
 */
function handleLintError(task, err) {
  const fullOutput = err?.message || '';
  const lines = fullOutput.split('\n');

  const relevant = lines.filter(
    (line) =>
      line.match(/^\s*\d+:\d+\s+(error|warning)\s+/) ||
      line.includes('ERROR') ||
      line.includes('✖') ||
      line.includes('.tsx') ||
      line.includes('.ts') ||
      line.includes('problem'),
  );

  errors.push({
    name: task.name,
    code: err.code ?? 1,
    message: verbose
      ? fullOutput
      : relevant.slice(-20).join('\n') || fullOutput.slice(-500),
  });

  console.warn(`⚠ Task failed: ${task.name}`);
}

/**
 * Simple async sleep utility.
 * @param {number} ms - Milliseconds to wait.
 * @returns {Promise<void>}
 */
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

(async () => {
  console.warn(`
⚠️  TEMPORARY TASK WARNING
─────────────────────────────────────────────
This script performs three actions:
  1. Turbo-based build (prebuild)
  2. Legacy linting using ESLint
  3. Modern linting using turbo (lint:modern)

It exists temporarily while not all apps have migrated
to the Static Analysis Kit.

⚠️  NOTE:
  - Build and lint:modern may take time because they
    are handled by Turbo and might be cache-miss.
  - Legacy lint is... well, like all legacy — slow 😅

Thanks for your patience ✨
─────────────────────────────────────────────
`);

  await wait(3000); // Wait 3 seconds before continuing

  for (const task of tasks) {
    console.log(`\n▶ Starting: ${task.name}`);
    console.log(`📦 Command: ${task.cmd.join(' ')}`);
    console.log('⏳ Waiting for output...\n');

    try {
      // Run the prepare step synchronously
      spawnSync('yarn', ['pm:prepare:legacy:workspace'], {
        shell: true,
        stdio: 'inherit',
      });

      // Run task
      await run(task.cmd[0], task.cmd.slice(1));

      // Clean up after process ends
      spawnSync('yarn', ['pm:remove:legacy:workspace'], {
        shell: true,
        stdio: 'inherit',
      });
    } catch (err) {
      handleLintError(task, err);
    }
  }

  if (errors.length > 0) {
    console.error(`\n🚫 Linting finished with errors:\n`);
    for (const failure of errors) {
      console.error(
        `\x1b[31m• ${failure.name}: Exited with code ${failure.code}\x1b[0m`,
      );
      console.error(
        '────────────────────────────────────────────────────────────',
      );
      console.error(failure.message);
      console.error(
        '────────────────────────────────────────────────────────────\n',
      );
    }
    process.exit(1);
  } else {
    console.log('\n✅ Linting completed successfully.');
    process.exit(0);
  }
})();
