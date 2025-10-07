#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import process from 'node:process';

import { combinedReportOutputRootDir } from './cli-path-config.js';

const qualityCheckEntryFile = resolve(combinedReportOutputRootDir, 'index.html');

const isTests = process.argv.includes('--tests');

const mainScripts = [
  'manager-code-duplication',
  'manager-types-coverage',
  'manager-tests-coverage',
  'manager-perf-budgets',
];

const testScripts = [
  'manager-code-duplication-tests',
  'manager-types-coverage-tests',
  'manager-tests-coverage-tests',
  'manager-perf-budgets-tests',
];

const scripts = isTests ? testScripts : mainScripts;

const reports = [
  {
    name: `Code Duplication${isTests ? ' (Tests)' : ''}`,
    folder: 'code-duplication-reports',
    base: 'code-duplication-combined-report',
  },
  {
    name: `Performance Budgets${isTests ? ' (Tests)' : ''}`,
    folder: 'perf-budgets-reports',
    base: 'perf-budgets-combined-report',
  },
  {
    name: `Tests Coverage${isTests ? ' (Tests)' : ''}`,
    folder: 'tests-coverage-reports',
    base: 'tests-coverage-combined-report',
  },
  {
    name: `Types Coverage${isTests ? ' (Tests)' : ''}`,
    folder: 'types-coverage-reports',
    base: 'types-coverage-combined-report',
  },
];

console.log(`🚀 Running static & dynamic quality ${isTests ? 'tests' : 'checks'}...\n`);

let remaining = scripts.length;
let failed = false;
const statuses = {};

function generateEntryReport() {
  const links = reports
    .map((report) => {
      const status = statuses[report.name] ?? 'unknown';
      const badge =
        status === 'success'
          ? '<span class="badge success">✅ Success</span>'
          : status === 'fail'
            ? '<span class="badge fail">❌ Failed</span>'
            : '<span class="badge unknown">❔ Unknown</span>';

      return `
        <li>
          <strong>${report.name}</strong> ${badge}<br/>
          <a href="./${report.folder}/${report.base}.html">📊 HTML Report</a> |
          <a href="./${report.folder}/${report.base}.json">📄 JSON Report</a>
        </li>`;
    })
    .join('\n');

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Static & Dynamic Quality ${isTests ? 'Tests' : 'Checks'} Reports</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 2rem; background: #f9f9f9; color: #333; }
    h1 { color: #2c3e50; }
    p.note { font-size: 0.9rem; color: #666; margin-bottom: 1.5rem; }
    ul { list-style-type: none; padding: 0; }
    li { margin: 1rem 0; padding: 1rem; background: #fff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    a { text-decoration: none; margin-right: 1rem; }
    .badge { padding: 0.2rem 0.6rem; border-radius: 6px; font-size: 0.85rem; margin-left: 0.5rem; }
    .success { background: #2ecc71; color: #fff; }
    .fail { background: #e74c3c; color: #fff; }
    .unknown { background: #95a5a6; color: #fff; }
  </style>
</head>
<body>
  <h1>Static & Dynamic Quality ${isTests ? 'Tests' : 'Checks'} Reports</h1>
  <p class="note">ℹ️ Status badges below reflect the <strong>script execution status</strong> (whether the CLI completed without error), <br/>not the actual content or results of the analysis.</p>
  <ul>
    ${links}
  </ul>
</body>
</html>`;

  writeFileSync(qualityCheckEntryFile, html, 'utf-8');
  console.log(`📄 Entry report generated at ${qualityCheckEntryFile}`);
}

scripts.forEach((cmd, idx) => {
  const child = spawn(cmd, { stdio: 'inherit', shell: true });

  child.on('exit', (code) => {
    console.log(`\n${code === 0 ? '✅' : '❌'} ${cmd} finished with code ${code}`);
    if (code === 0) {
      statuses[reports[idx].name] = 'success';
    } else {
      statuses[reports[idx].name] = 'fail';
      failed = true;
    }
    remaining -= 1;

    if (remaining === 0) {
      console.log(
        failed
          ? '\n⚠️ Some quality scripts failed, but reports will still be generated.'
          : `\n🎉 All quality ${isTests ? 'tests' : 'checks'} completed successfully`,
      );

      try {
        generateEntryReport();
      } catch (err) {
        console.error('❌ Failed to generate entry report:', err);
      }

      process.exit(failed ? 1 : 0);
    }
  });
});
