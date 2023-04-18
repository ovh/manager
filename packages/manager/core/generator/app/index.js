/* eslint-disable import/extensions */
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getApiPaths } from '../utils/api.js';

const appDirectory = dirname(fileURLToPath(import.meta.url));

export default (plop) => {
  plop.setGenerator('app', {
    description: 'Create a React app',
    prompts: [
      {
        type: 'input',
        name: 'appName',
        message: 'What is the name of the new app?',
      },
      {
        type: 'input',
        name: 'packageName',
        message: 'What is the packageName of the new app?',
        default: ({ appName }) => {
          return `@ovh-ux/manager-${appName}-app`;
        },
      },
      {
        type: 'input',
        name: 'description',
        message: 'How would you describe the new app?',
      },
      {
        type: 'autocomplete',
        name: 'apiPath',
        message: 'What API base route is used?',
        source: async (_, input) => {
          const paths = await getApiPaths();
          return paths.filter((p) => p.includes(input || '/'));
        },
      },
    ],
    actions: [
      {
        type: 'addMany',
        destination: join(appDirectory, '../../../apps/{{dashCase appName}}'),
        templateFiles: join(appDirectory, './templates/**'),
        base: join(appDirectory, './templates'),
      },
      ({ appName, packageName }) =>
        `App ${appName} generated. Please run \n  yarn install && yarn workspace ${packageName} run start:dev`,
    ],
  });
};
