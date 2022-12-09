import { existsSync, readdirSync, readFileSync } from 'fs';
import { basename } from 'path';
import concurrently from 'concurrently';
import execa from 'execa';
import inquirer from 'inquirer';

/**
 * Workspace location for all applications.
 * @type {string}
 */
const applicationsWorkspace = 'packages/manager/apps';

/**
 * Container application package name
 * @type {string}
 */
const containerPackageName = '@ovh-ux/manager-container-app';

/**
 * List all applications available for a given workspace.
 * @return {Array} Applications' list.
 */
const getApplications = () =>
  readdirSync(applicationsWorkspace, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map(({ name }) => ({ application: name }))
    .filter(({ application }) =>
      existsSync(`${applicationsWorkspace}/${application}/package.json`),
    )
    .map(({ application }) => {
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
  {
    type: 'confirm',
    name: 'container',
    message: 'Start the application inside the container?',
    default: true,
    // Skip for container
    when: ({ packageName }) => packageName !== containerPackageName,
  },
];

async function getApplicationId(packageName) {
  return basename(
    JSON.parse((await execa('yarn', ['workspaces', 'info'])).stdout)[
      packageName
    ].location,
  );
}

inquirer
  .prompt(questions)
  .then(async ({ packageName, region = 'EU', container = false }) => {
    /**
     * Region is defined as an environment variable which is used by the webpack
     * development server.
     *
     * {@link https://github.com/ovh/manager/tree/master/packages/manager/tools/webpack-dev-server#env | webpack dev server }
     */
    process.env.REGION = region;
    try {
      if (container) {
        const appId = await getApplicationId(packageName);
        await concurrently(
          [
            `VITE_CONTAINER_APP=${appId} yarn workspace ${containerPackageName} run start:dev`,
            `CONTAINER=1 yarn workspace ${packageName} run start:dev`,
          ],
          {
            raw: true,
          },
        );
      } else {
        await execa('yarn', ['workspace', packageName, 'run', 'start:dev'], {
          stdio: 'inherit',
        });
      }
    } catch (error) {
      console.log(error);
    }
  });
