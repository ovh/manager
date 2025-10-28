import concurrently from 'concurrently';
import inquirer from 'inquirer';
import inquirerSearchList from 'inquirer-search-list';
import process from 'node:process';

import { containerPackageName, managerRootPath } from '../../playbook/playbook-config.js';
import { clearRootWorkspaces, updateRootWorkspacesFromCatalogs } from '../utils/catalog-utils.js';
import { logger } from '../utils/log-manager.js';
import { resolveBuildFilter } from '../utils/tasks-utils.js';
import { getApplicationId, getApplications } from '../utils/workspace-utils.js';

/**
 * @typedef {Object} StartAppOptions
 * @property {string}  [defaultRegion="EU"]       - Default region preselected in the prompt.
 * @property {boolean} [defaultContainer=true]    - Default choice for running inside the container.
 * @property {boolean} [raw=true]                 - Pass raw output to the parent process (concurrently option).
 * @property {"failure"|"success"|"always"} [killOthers="failure"] - Kill other processes when one exits.
 */

/**
 * Register inquirer custom prompt (searchable list).
 */
function registerPrompts() {
  inquirer.registerPrompt('search-list', inquirerSearchList);
}

/**
 * Build the interactive questions to ask the user.
 *
 * @param {Array<{ value: string, regions?: string[] }>} apps - List of available applications.
 * @param {string} defaultRegion - Default region preselected.
 * @param {boolean} defaultContainer - Default container mode.
 * @returns {import('inquirer').QuestionCollection}
 */
function buildQuestions(apps, defaultRegion, defaultContainer) {
  return [
    {
      type: 'search-list',
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
}

/**
 * Build the concurrently commands for app + container.
 *
 * @param {string} packageName - Selected package name.
 * @param {string} appFilter - Turbo filter for the app.
 * @param {boolean} container - Whether to run inside container mode.
 * @returns {Promise<Array<{ name: string, command: string, cwd: string, env?: NodeJS.ProcessEnv, prefixColor?: string }>>}
 */
async function buildCommands(packageName, appFilter, container) {
  /** @type {Array<any>} */
  const commands = [];

  if (container && packageName !== containerPackageName) {
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

  return commands;
}

/**
 * Run the concurrently process with cleanup logic.
 *
 * @param {Array<any>} commands - Commands to execute.
 * @param {boolean} raw - Whether to pass raw output.
 * @param {"failure"|"success"|"always"} killOthers - Kill other processes policy.
 */
async function runWithCleanup(commands, raw, killOthers) {
  try {
    const { result } = concurrently(commands, {
      raw,
      prefix: 'name',
      timestamp: true,
      killOthers,
    });
    await result;
    logger.info('✅ Start completed');
  } finally {
    await clearRootWorkspaces();
    logger.info('🧹 Root workspaces restored');
  }
}

/**
 * Start an application (optionally inside the container) with Turbo.
 *
 * Steps performed:
 *   1. Prompt the user to pick the app/region/container mode
 *   2. Temporarily restore hybrid workspaces (so PNPM-only apps are visible)
 *   3. Spawn the requested Turbo processes via `concurrently`
 *   4. Always clear the root workspaces back to normal on exit
 *
 * Environment:
 *   - Sets `process.env.REGION` to the chosen region.
 *   - When running in container mode:
 *       - `VITE_CONTAINER_APP=<appId>` is passed to the container process
 *       - `CONTAINER=1` is passed to the app process
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

  registerPrompts();

  const apps = getApplications();
  if (!apps.length) {
    throw new Error('No applications found under configured applicationsBasePath.');
  }

  const questions = buildQuestions(apps, defaultRegion, defaultContainer);
  const {
    packageName,
    region = defaultRegion,
    container = false,
  } = await inquirer.prompt(questions);

  if (!packageName) throw new Error('No application selected.');

  process.env.REGION = region;
  logger.info(`🌍 REGION=${region}`);
  logger.info(`📦 Package: ${packageName}${container ? ' (container mode)' : ''}`);

  await updateRootWorkspacesFromCatalogs();

  const appFilter = resolveBuildFilter(packageName) ?? packageName;
  const commands = await buildCommands(packageName, appFilter, container);

  await runWithCleanup(commands, raw, killOthers);
}
