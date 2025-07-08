#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync } from 'fs';
import fs from 'fs/promises';
import { basename, resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import concurrently from 'concurrently';
import execa from 'execa';
import inquirer from 'inquirer';
import inquirerSearchList from 'inquirer-search-list';
import { createTempBackup, restoreFromTempBackup } from './utils/temp-package-backup-utils.mjs';
import { registerCleanupOnSignals } from './utils/cleanup-utils.mjs';

// -- Proper __dirname setup for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// -- Paths
const repoRoot = resolve(__dirname, '..', '..');
const packageJsonPath = join(repoRoot, 'package.json');

// -- Workspace logic
const applicationsWorkspace = 'packages/manager/apps';
const containerPackageName = '@ovh-ux/manager-container-app';

const getApplications = () =>
  readdirSync(applicationsWorkspace, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map(({ name }) => ({ application: name }))
    .filter(({ application }) =>
      existsSync(`${applicationsWorkspace}/${application}/package.json`)
    )
    .map(({ application }) => {
      const data = readFileSync(
        `${applicationsWorkspace}/${application}/package.json`,
        'utf8'
      );
      const { name, regions } = JSON.parse(data);
      const [, formatedName] = name.split('/');
      return { name: formatedName, value: name, regions };
    });

const questions = [
  {
    type: 'search-list',
    name: 'packageName',
    message: 'Which application do you want to start?',
    choices: getApplications,
  },
  {
    type: 'list',
    name: 'region',
    message: 'Please specify the region:',
    choices({ packageName }) {
      const { regions } = getApplications().find(
        ({ value }) => value === packageName
      );
      if (!regions) {
        throw new Error(`No regions found in ${packageName} package.json`);
      }
      return regions;
    },
  },
  {
    type: 'confirm',
    name: 'container',
    message: 'Start the application inside the container?',
    default: true,
    when: ({ packageName }) => packageName !== containerPackageName,
  },
];

async function getApplicationId(packageName) {
  try {
    const { stdout } = await execa('yarn', ['workspaces', 'info', '--json']);

    let workspaces;

    try {
      workspaces = JSON.parse(stdout); // Yarn 3
    } catch {
      const outer = JSON.parse(stdout); // Yarn 1/2
      if (!outer.data) throw new Error('Missing "data" field in yarn output');
      workspaces = JSON.parse(outer.data);
    }

    if (!workspaces[packageName]) {
      console.error('📦 Available workspaces:', Object.keys(workspaces));
      throw new Error(`❌ No workspace found for "${packageName}"`);
    }

    return basename(workspaces[packageName].location);
  } catch (err) {
    console.error('❌ Failed to retrieve application ID via Yarn');
    console.error('📛 Error:', err.message);
    throw err;
  }
}

inquirer.registerPrompt('search-list', inquirerSearchList);

async function main() {
  console.log('🔧 Preparing Yarn-compatible environment...');
  createTempBackup();
  registerCleanupOnSignals(restoreFromTempBackup);

  try {
    const { packageName, region = 'EU', container = false } = await inquirer.prompt(questions);
    process.env.REGION = region;

    if (container) {
      const appId = await getApplicationId(packageName);

      await concurrently(
        [
          {
            command: `VITE_CONTAINER_APP=${appId} turbo run start --filter=${containerPackageName}`,
            name: 'container',
          },
          {
            command: `CONTAINER=1 turbo run start --filter=${packageName}`,
            name: 'app',
          },
        ],
        {
          raw: true,
          successCondition: 'first',
        }
      );
    } else {
      await concurrently(
        [
          {
            command: `turbo run start --filter=${packageName}`,
            name: 'app',
          },
        ],
        {
          raw: true,
          successCondition: 'first',
        }
      );
    }
  } catch (err) {
    console.error('❌ Failed to start application:', err);
  } finally {
    restoreFromTempBackup();
  }
}

main();
