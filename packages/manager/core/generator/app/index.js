import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import fuzzy from 'fuzzy';

import { getApiPaths } from '../utils/api.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

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
        source: async ({ appName }, input) => {
          const paths = await getApiPaths();

          return fuzzy
            .filter(input || `${appName}`, paths)
            .map((el) => el.original);
        },
      },
    ],
    actions: [
      {
        type: 'addMany',
        destination: join(__dirname, '../../../apps/{{dashCase appName}}'),
        templateFiles: join(__dirname, './templates/**'),
        base: join(__dirname, './templates'),
      },
      ({ appName, packageName }) =>
        `App ${appName} generated. Please run \n  yarn install && yarn workspace ${packageName} run start:dev`,
    ],
  });
};
