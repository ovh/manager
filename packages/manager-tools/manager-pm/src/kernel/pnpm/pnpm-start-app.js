import concurrently from 'concurrently';
import inquirer from 'inquirer';
import inquirerSearchList from 'inquirer-search-list';
import process from 'node:process';

import { containerPackageName, managerRootPath } from '../../playbook/playbook-config.js';
import { getApplicationId, getApplications } from '../commons/workspace-utils.js';
import { updateRootWorkspacesFromCatalogs, clearRootWorkspaces } from '../commons/catalog-utils.js';
import { resolveBuildFilter } from '../commons/task-utils.js';
import { logger } from '../commons/log-manager.js';

/**
 * @typedef {Object} StartAppOptions
 * @property {string}  [defaultRegion="EU"]       - Default region preselected in the prompt.
 * @property {boolean} [defaultContainer=true]    - Default choice for running inside the container.
 * @property {boolean} [raw=true]                 - Pass raw output to the parent process (concurrently option).
 * @property {"failure"|"success"|"always"} [killOthers="failure"] - Kill other processes when one exits.
 */

/**
 * Start an application (optionally inside the container) with Turbo.
 *
 * This function:
 *  1) Prompts the user to pick the app/region/container mode,
 *  2) Temporarily restores hybrid workspaces (so PNPM-only apps are visible),
 *  3) Spawns the requested Turbo processes via `concurrently`,
 *  4) Always clears the root workspaces back to normal on exit.
 *
 * Environment:
 *  - Sets `process.env.REGION` to the chosen region.
 *  - When running in container mode, passes:
 *      - `VITE_CONTAINER_APP=<appId>` to the container process
 *      - `CONTAINER=1` to the app process
 *
 * @param {StartAppOptions} [options]
 * @returns {Promise<void>}
 * @throws {Error} If no application is selected or resolution fails.
 */
export async function startApp(options = {}) {
  const {
    defaultRegion = 'EU',
    defaultContainer = true,
    raw = true,
    killOthers = 'failure',
  } = options;

  // Register searchable list prompt (you were registering it already)
  inquirer.registerPrompt('search-list', inquirerSearchList);

  // Preload apps once (avoid recomputing in choices functions)
  const apps = getApplications();
  if (!apps.length) {
    throw new Error('No applications found under configured applicationsBasePath.');
  }

  /** @type {import('inquirer').QuestionCollection} */
  const questions = [
    {
      type: 'search-list', // searchable 🥳
      name: 'packageName',
      message: 'Which application do you want to start?',
      choices: apps,
      pageSize: Math.min(15, apps.length),
    },
    {
      type: 'list',
      name: 'region',
      message: 'Please specify the region:',
      default: defaultRegion,
      choices: (answers) => {
        const app = apps.find(({ value }) => value === answers.packageName);
        if (!app?.regions) {
          throw new Error(`No regions found in ${answers.packageName} package.json`);
        }
        return app.regions;
      },
      validate: (input) => !!input || 'Region is required.',
    },
    {
      type: 'confirm',
      name: 'container',
      message: 'Start the application inside the container?',
      default: defaultContainer,
      when: (answers) => answers.packageName !== containerPackageName,
    },
  ];

  const { packageName, region = defaultRegion, container = false } = await inquirer.prompt(questions);
  if (!packageName) throw new Error('No application selected.');

  // Make REGION visible to children spawned below
  process.env.REGION = region;
  logger.info(`🌍 REGION=${region}`);
  logger.info(`📦 Package: ${packageName}${container ? ' (container mode)' : ''}`);

  // 1) Ensure hybrid visibility (e.g., PNPM-only apps become visible to Turbo)
  await updateRootWorkspacesFromCatalogs();

  // 2) Build Turbo filters
  const appFilter = resolveBuildFilter(packageName) ?? packageName;

  // 3) Build concurrently commands
  /** @type {Array<{
   *   name: string,
   *   command: string,
   *   cwd: string,
   *   env?: NodeJS.ProcessEnv,
   *   prefixColor?: string
   * }>} */
  const commands = [];

  if (container && packageName !== containerPackageName) {
    // Resolve app id via local discovery (works even if Yarn workspaces ignore it)
    const appId = await getApplicationId(packageName);

    commands.push({
      name: 'container',
      command: `turbo run start --filter=${containerPackageName}`,
      cwd: managerRootPath,
      env: { ...process.env, VITE_CONTAINER_APP: appId },
      prefixColor: 'cyan',
    });

    commands.push({
      name: 'app',
      command: `turbo run start --filter=${appFilter}`,
      cwd: managerRootPath,
      env: { ...process.env, CONTAINER: '1' },
      prefixColor: 'magenta',
    });
  } else {
    commands.push({
      name: 'app',
      command: `turbo run start --filter=${appFilter}`,
      cwd: managerRootPath,
      env: process.env,
      prefixColor: 'magenta',
    });
  }

  // 4) Run! Ensure cleanup no matter what.
  try {
    const { result } = concurrently(commands, {
      raw,
      prefix: 'name',   // show [container] / [app] before each line
      timestamp: true,  // add hh:mm:ss
      killOthers,       // stop sibling on failure by default
    });
    await result;
    logger.info('✅ Start completed');
  } finally {
    await clearRootWorkspaces();
    logger.info('🧹 Root workspaces restored');
  }
}
