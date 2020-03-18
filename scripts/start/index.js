import execa from 'execa';
import inquirer from 'inquirer';

const applications = new Set([
  '@ovh-ux/manager-hub',
  '@ovh-ux/manager-dedicated',
  '@ovh-ux/manager-cloud',
  '@ovh-ux/manager-public-cloud',
]);

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
  // TODO: Could be deprecated as soon as we will rely on an Env Executor.
  {
    type: 'list',
    name: 'region',
    message: 'Please specify the region:',
    choices: [
      { name: 'Europe', value: 'EU' },
      { name: 'Canada', value: 'CA' },
      { name: 'United States', value: 'US' },
    ],
    when({ packageName }) {
      return applications.has(packageName);
    },
  },
];

inquirer.prompt(questions).then(async ({ packageName, region = 'EU' }) => {
  process.env.REGION = region;
  try {
    await execa('yarn', ['workspace', packageName, 'run', 'start:dev'], {
      stdio: 'inherit',
    });
  } catch (error) {
    console.log(error);
  }
});
