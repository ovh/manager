import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

import { resolveAppInfo } from './apps-utils.js';
import { generateCombinedReports } from './file-utils.js';
import { logError, logInfo } from './log-utils.js';

/**
 * Ensure the given binary exists.
 */
export function ensureBinExists(binPath, label) {
  if (!fs.existsSync(binPath)) {
    logError(`❌ ${label} binary not found at ${binPath}`);
    process.exit(1);
  }
}

/**
 * Run a child process with consistent defaults.
 */
export function runCommand(bin, args, cwd) {
  const result = spawnSync(bin, args, {
    cwd,
    stdio: 'inherit',
    shell: true,
  });
  return result.status === 0;
}

/**
 * Generic per-app analysis runner with safety.
 */
export function runAppsAnalysis({
  appsDir,
  appFolders,
  requireReact = false,
  binaryLabel,
  appRunner, // (appDir, appShortName, appInfo) => boolean
  reportsRootDirName,
  combinedJson,
  combinedHtml,
  collectFn,
  generateHtmlFn,
  outputRootDir,
}) {
  const analyzed = [];

  for (const appFolder of appFolders) {
    const appInfo = resolveAppInfo(appsDir, appFolder, { requireReact });
    if (!appInfo) continue;

    let ok = false;
    try {
      ok = appRunner(appInfo.appDir, appInfo.appShortName, appInfo);
    } catch (err) {
      logError(
        `❌ Fatal error while analyzing ${appInfo.appShortName}: ${err.stack || err.message}`,
      );
    }
    if (ok) analyzed.push(appInfo.appShortName);
  }

  if (analyzed.length > 0) {
    if (typeof collectFn !== 'function' || typeof generateHtmlFn !== 'function') {
      logError(`❌ Invalid collector or HTML generator passed to ${binaryLabel} analysis`);
      process.exit(1);
    }

    generateCombinedReports(
      path.join(outputRootDir, reportsRootDirName),
      combinedJson,
      combinedHtml,
      collectFn,
      generateHtmlFn,
    );
    logInfo(`✅ ${binaryLabel} reports generated (per-app + combined).`);
  } else {
    logError('❌ No apps successfully analyzed. Exiting.');
    process.exit(1);
  }

  return analyzed;
}
