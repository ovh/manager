#!/usr/bin/env node

/* eslint-disable */

const { spawn, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const argv = process.argv.slice(2);

const getFlagValue = (flag) => {
  const idx = argv.indexOf(flag);
  if (idx === -1) return null;
  return argv[idx + 1] ?? null;
};

const hasFlag = (flag) => argv.includes(flag);

const appValue = getFlagValue('--app');
const fix = hasFlag('--fix');
const verbose = !hasFlag('--quiet');
const isCI = Boolean(process.env.CI);

const isPackageName = Boolean(appValue && appValue.startsWith('@'));
const appName = isPackageName ? null : appValue;
const packageName = isPackageName ? appValue : null;

const appsRoot = path.join(__dirname, '../../packages/manager/apps');

function listApps(rootDir) {
  return fs
    .readdirSync(rootDir)
    .filter((dir) => fs.statSync(path.join(rootDir, dir)).isDirectory());
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function getModernApps(allApps) {
  return allApps.filter((app) => {
    const appPath = path.join(appsRoot, app);
    const configExists = fs.existsSync(path.join(appPath, 'eslint.config.mjs'));
    const pkgPath = path.join(appPath, 'package.json');

    if (!configExists || !fs.existsSync(pkgPath)) return false;

    try {
      const pkg = readJson(pkgPath);
      return Boolean(pkg.scripts && pkg.scripts['lint:modern']);
    } catch (err) {
      if (verbose)
        console.error(`🔴 Error reading package.json in ${app}:`, err);
      return false;
    }
  });
}

/**
 * We ignore modern apps from legacy lint unless user targets a single app/package.
 * IMPORTANT: pass ignore patterns as separate args (no shell quoting needed).
 */
function buildIgnorePatterns(modernAppsList) {
  if (appName || isPackageName) return [];
  return modernAppsList.flatMap((app) => [
    '--ignore-pattern',
    `packages/manager/apps/${app}/**`,
  ]);
}

function buildLegacyPatterns() {
  return appName
    ? [`packages/manager/apps/${appName}/**/*.ts`]
    : ['packages/manager/apps/**/*.ts'];
}

const allApps = listApps(appsRoot);
const modernApps = getModernApps(allApps);
const ignorePatterns = buildIgnorePatterns(modernApps);
const legacyPatterns = buildLegacyPatterns();

if (verbose) {
  console.log(`🗂️ Legacy lint patterns:\n${legacyPatterns.join('\n')}`);
  if (ignorePatterns.length > 0) {
    console.log(
      `🚫 Ignored modern apps:\n${modernApps
        .map((a) => `packages/manager/apps/${a}/**`)
        .join('\n')}`,
    );
  }
}

/**
 * Turbo flags for CI:
 * - stream logs (avoid grouped logs / silence)
 * - full logs (debuggable)
 * - cap concurrency (stability on CI)
 */
const turboCIFlags = isCI
  ? ['--log-order=stream', '--output-logs=full', '--concurrency=2']
  : [];

const turboTask = fix ? 'lint:modern:fix' : 'lint:modern';

function yarnCmd(...args) {
  return ['yarn', ...args];
}

function buildTurboCmd() {
  const base = ['-s', 'turbo', 'run', turboTask, '--continue', ...turboCIFlags];

  if (isPackageName) return yarnCmd(...base, '--filter', packageName);
  if (appName) return yarnCmd(...base, '--filter', appName);
  return yarnCmd(...base);
}

function buildLegacyLintCmd() {
  return yarnCmd(
    '-s',
    'eslint',
    ...(fix ? ['--fix'] : []),
    '--quiet',
    ...legacyPatterns,
    ...ignorePatterns,
  );
}

const tasks = [];
if (!isPackageName) {
  tasks.push({
    name: appName ? `legacy lint:tsx (${appName})` : 'legacy lint:tsx',
    cmd: buildLegacyLintCmd(),
  });
}
tasks.push({
  name: `modern ${turboTask} (Turbo)`,
  cmd: buildTurboCmd(),
});

const errors = [];
let currentChild = null;
let shuttingDown = false;

function prepareWorkspace() {
  spawnSync('yarn', ['pm:prepare:legacy:workspace'], {
    shell: false,
    stdio: 'inherit',
  });
}

function cleanupWorkspace() {
  spawnSync('yarn', ['pm:remove:legacy:workspace'], {
    shell: false,
    stdio: 'inherit',
  });
}

function killChild(signal) {
  if (!currentChild || !currentChild.pid) return;
  try {
    // POSIX: kill process group
    process.kill(-currentChild.pid, signal);
  } catch {
    // ignore
  }
}

function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;

  if (verbose)
    console.warn(`\n🛑 Received ${signal} — cleaning up workspace...`);

  killChild(signal);

  try {
    cleanupWorkspace();
  } catch {
    // ignore
  }

  process.exit(signal === 'SIGINT' ? 130 : 143);
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

process.on('uncaughtException', (err) => {
  console.error('🔴 Uncaught exception:', err);
  try {
    cleanupWorkspace();
  } finally {
    process.exit(1);
  }
});

process.on('unhandledRejection', (err) => {
  console.error('🔴 Unhandled rejection:', err);
  try {
    cleanupWorkspace();
  } finally {
    process.exit(1);
  }
});

/**
 * Run a command and capture output while streaming if verbose.
 * - stdin: inherit (don’t close it)
 * - detached: true so we can kill the whole process group on SIGTERM
 */
function run(cmd) {
  const [command, ...args] = cmd;

  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, {
      shell: false,
      detached: true,
      stdio: ['inherit', 'pipe', 'pipe'],
    });

    currentChild = proc;

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

    proc.on('close', (code, signal) => {
      currentChild = null;

      if (signal) {
        return reject({
          code: 1,
          message: `Process terminated by signal ${signal}\n${stdout}${stderr}`,
        });
      }

      if (verbose) console.log(`⏹ Exit code: ${code}`);

      if (code !== 0) return reject({ code, message: stdout + stderr });
      resolve(stdout);
    });

    proc.on('error', (err) => {
      currentChild = null;
      reject({ code: 1, message: err.message || 'Unknown process error' });
    });
  });
}

function handleLintError(task, err) {
  const fullOutput = err?.message || '';
  const lines = fullOutput.split('\n');

  const relevant = lines.filter(
    (line) =>
      /^\s*\d+:\d+\s+(error|warning)\s+/.test(line) ||
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

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

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

  await wait(1000);

  for (const task of tasks) {
    console.log(`\n▶ Starting: ${task.name}`);
    console.log(`📦 Command: ${task.cmd.join(' ')}`);
    console.log('⏳ Waiting for output...\n');

    prepareWorkspace();
    try {
      await run(task.cmd);
    } catch (err) {
      handleLintError(task, err);
    } finally {
      try {
        cleanupWorkspace();
      } catch (e) {
        console.warn('⚠ Workspace cleanup failed:', e?.message || e);
      }
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
  }

  console.log('\n✅ Linting completed successfully.');
  process.exit(0);
})();
