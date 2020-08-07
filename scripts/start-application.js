import { readdirSync, readFileSync } from 'fs';
import execa from 'execa';
import inquirer from 'inquirer';

/**
 * Set of applications that doesn't rely on multiple regions.
 * @type {Set}
 */
const applicationWithoutRegions = new Set([
  '@ovh-ux/manager-carrier-sip-app',
  '@ovh-ux/manager-freefax-app',
  '@ovh-ux/manager-overthebox-app',
  '@ovh-ux/manager-sms-app',
  '@ovh-ux/manager-telecom',
  '@ovh-ux/manager-telecom-dashboard-app',
  '@ovh-ux/manager-telecom-task-app',
]);

/**
 * Regions where applications can be available.
 * @type {Array}
 */
const availableRegions = [
  { name: 'Europe', value: 'EU' },
  { name: 'Canada', value: 'CA' },
  { name: 'United States', value: 'US' },
];

/**
 * Workspace location for all applications.
 * @type {string}
 */
const applicationsWorkspace = 'packages/manager/apps';

/**
 * List all applications available for a given workspace.
 * @return {Array} Applications' list.
 */
const choices = () =>
  readdirSync(applicationsWorkspace, {
    withFileTypes: true,
  }).map((application) => {
    const data = readFileSync(
      `${applicationsWorkspace}/${application.name}/package.json`,
      'utf8',
    );
    const { name } = JSON.parse(data);
    // Skip scoped package name.
    // `@ovh-ux/foo` => `foo`.
    const [, formatedName] = name.split('/');

    return {
      name: formatedName,
      value: name,
    };
  });

/**
 * Ask for both packageName and region to start the corresponding application.
 */
const questions = [
  {
    type: 'list',
    name: 'packageName',
    message: 'Which application do you want to start?',
    choices,
  },
  {
    type: 'list',
    name: 'region',
    message: 'Please specify the region:',
    choices({ packageName }) {
      // Trick to remove US from the regions list (non-available).
      if (packageName === '@ovh-ux/manager-web') {
        availableRegions.pop();
      }

      return availableRegions;
    },
    when({ packageName }) {
      return !applicationWithoutRegions.has(packageName);
    },
  },
];

inquirer.prompt(questions).then(async ({ packageName, region = 'EU' }) => {
  /**
   * Region is defined as an environment variable which is used by the webpack
   * development server.
   *
   * {@link https://github.com/ovh/manager/tree/master/packages/manager/tools/webpack-dev-server#env | webpack dev server }
   */
  process.env.REGION = region;

  try {
    await execa('yarn', ['workspace', packageName, 'run', 'start:dev'], {
      stdio: 'inherit',
    });
  } catch (error) {
    console.log(error);
  }
});
