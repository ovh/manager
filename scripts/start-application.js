import { readdirSync, readFileSync } from 'fs';
import execa from 'execa';
import inquirer from 'inquirer';

/**
 * Workspace location for all applications.
 * @type {string}
 */
const applicationsWorkspace = 'packages/manager/apps';

/**
 * List all applications available for a given workspace.
 * @return {Array} Applications' list.
 */
const getApplications = () =>
  readdirSync(applicationsWorkspace, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map(({ name: application }) => {
      const data = readFileSync(
        `${applicationsWorkspace}/${application}/package.json`,
        'utf8',
      );
      const { name, regions } = JSON.parse(data);
      // Skip scoped package name.
      // `@ovh-ux/foo` => `foo`.
      const [, formatedName] = name.split('/');

      return {
        name: formatedName,
        value: name,
        regions,
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
    choices: getApplications,
  },
  {
    type: 'list',
    name: 'region',
    message: 'Please specify the region:',
    choices({ packageName }) {
      const { regions } = getApplications().find(
        ({ value }) => value === packageName,
      );
      return regions;
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
