import execa from 'execa';
import inquirer from 'inquirer';

/**
 * Set of applications that doesn't rely on multiple regions.
 * @type {Set}
 */
const applicationWithoutRegions = new Set(['@ovh-ux/manager-telecom']);

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
 * Ask for both packageName and region to start the corresponding application.
 * @todo Dynamically list all applications available from a given workspace.
 */
const questions = [
  {
    type: 'list',
    name: 'packageName',
    message: 'Which control panel do you want to start?',
    choices: [
      {
        name: 'Hub',
        value: '@ovh-ux/manager-hub-app',
      },
      {
        name: 'Web',
        value: '@ovh-ux/manager-web',
      },
      {
        name: 'Server (Dedicated)',
        value: '@ovh-ux/manager-dedicated',
      },
      {
        name: 'Server (Cloud)',
        value: '@ovh-ux/manager-cloud',
      },
      {
        name: 'Public Cloud',
        value: '@ovh-ux/manager-public-cloud',
      },
      {
        name: 'Telecom',
        value: '@ovh-ux/manager-telecom',
      },
    ],
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
