/* eslint-disable import/extensions */
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getApiPaths, getApiEndpointQueryData } from '../utils/api.js';

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
      {
        type: 'list',
        name: 'listingEndpoint',
        message: 'What is the listing endpoint?',
        when: async (data) => {
          const result = await getApiEndpointQueryData(data.apiPath);
          // eslint-disable-next-line no-param-reassign
          data.apiV6Endpoints = result;
          return true;
        },
        choices: async ({ apiV6Endpoints }) =>
          apiV6Endpoints.map(({ apiPath, fileName }) => ({
            name: apiPath,
            value: fileName,
          })),
      },
    ],
    actions: ({ apiV6Endpoints }) => {
      const createApiQueryFilesActions = apiV6Endpoints.map((endpointData) => ({
        type: 'add',
        path: join(
          appDirectory,
          `../../../apps/{{dashCase appName}}/src/api/${endpointData.filepathFromIndex}`,
        ),
        templateFile: join(appDirectory, '../utils/api-query-template.ts.hbs'),
        data: endpointData,
      }));

      return [
        {
          type: 'addMany',
          destination: join(appDirectory, '../../../apps/{{dashCase appName}}'),
          templateFiles: join(appDirectory, './templates/**'),
          base: join(appDirectory, './templates'),
        },
        ...createApiQueryFilesActions,
        ({ appName, packageName }) =>
          `App ${appName} generated. Please run \n  yarn install && yarn workspace ${packageName} run start:dev`,
      ];
    },
  });
};
