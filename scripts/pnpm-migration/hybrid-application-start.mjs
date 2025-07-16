import { existsSync, readdirSync, readFileSync, copyFileSync } from 'fs';
import fs from 'fs/promises';
import { basename, resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import concurrently from 'concurrently';
import execa from 'execa';
import inquirer from 'inquirer';
import inquirerSearchList from 'inquirer-search-list';

// -- Proper __dirname setup for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// -- Paths
const repoRoot = resolve(__dirname, '..', '..');
const packageJsonPath = join(repoRoot, 'package.json');
const packageOriginalBackupPath = join(__dirname, 'package-original-backup.json');
const packageYarnBackupPath = join(__dirname, 'package-yarn-backup.json');

// -- Restore helpers
function fileExists(p) {
  return existsSync(p);
}

function restorePackage(fromPath, toPath, label) {
  if (fileExists(fromPath)) {
    copyFileSync(fromPath, toPath);
    console.log(`✅ Restored ${label}: ${basename(fromPath)} → ${basename(toPath)}`);
  } else {
    console.warn(`⚠️ Skipped ${label}: ${basename(fromPath)} not found`);
  }
}

function beforeStart() {
  console.log('🔧 Restoring Yarn-compatible package.json...');
  restorePackage(packageOriginalBackupPath, packageJsonPath, 'original package.json');
}

function afterStart() {
  console.log('\n🧼 Restoring PNPM-compatible package.json...');
  restorePackage(packageYarnBackupPath, packageJsonPath, 'yarn-backed package.json');
}

function registerExitHandlers() {
  const cleanupAndExit = () => {
    afterStart();
    process.exit(0);
  };

  process.on('SIGINT', () => {
    console.log('\n🛑 Caught SIGINT (Ctrl+C)');
    cleanupAndExit();
  });

  process.on('SIGTERM', () => {
    console.log('\n🛑 Caught SIGTERM');
    cleanupAndExit();
  });

  process.on('exit', () => {
    cleanupAndExit();
  });
}

// === Workspace logic ===
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
  beforeStart();
  registerExitHandlers(); // ensure cleanup on all exits

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
          successCondition: 'first', // Wait until all complete or interrupt
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
  }
}

main();
