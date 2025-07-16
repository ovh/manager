#!/usr/bin/env node

const { spawn } = require('child_process');

const appArgIndex = process.argv.indexOf('--app');
const fix = process.argv.includes('--fix');
const appValue = appArgIndex !== -1 ? process.argv[appArgIndex + 1] : null;

const isPackageName = appValue?.startsWith('@');
const appName = isPackageName ? null : appValue; // folder name
const packageName = isPackageName ? appValue : null; // turbo package

const legacyPattern = appName
  ? [`packages/manager/apps/${appName}/**/*.{tsx,ts}`]
  : [
    'packages/manager/apps/**/*.{tsx,ts}',
    'packages/manager-react-components/**/*.{tsx,ts}',
  ];

const tasks = [];

if (!isPackageName) {
  tasks.push({
    name: appName ? `legacy lint:tsx (${appName})` : 'legacy lint:tsx',
    cmd: ['eslint', ...(fix ? ['--fix'] : []), '--quiet', ...legacyPattern],
  });
}

tasks.push({
  name: 'modern lint:modern (Turbo)',
  cmd: isPackageName
    ? ['turbo', 'run', 'lint:modern', '--filter', packageName]
    : appName
      ? ['turbo', 'run', 'lint:modern', '--filter', appName]
      : ['turbo', 'run', 'lint:modern'],
});

const errors = [];

async function run(command, args) {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, {
      shell: true,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', (data) => (stdout += data.toString()));
    proc.stderr.on('data', (data) => (stderr += data.toString()));

    proc.on('close', (code) => {
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
    message: relevant.slice(-20).join('\n') || fullOutput.slice(-500),
  });

  console.warn(`⚠ Task failed: ${task.name}`);
}

(async () => {
  for (const task of tasks) {
    console.log(`\n▶ Starting: ${task.name}`);
    console.log('⏳ Waiting for output...\n');

    try {
      await run(task.cmd[0], task.cmd.slice(1));
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
