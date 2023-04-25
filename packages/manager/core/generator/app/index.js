/* eslint-disable import/extensions */
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
<<<<<<< HEAD
import { getApiPaths } from '../utils/api.js';
import { getApiv6TemplateData } from '../utils/api-template.js';
import {
  createPages,
  createTranslations,
  createApiQueryFilesActions,
} from '../utils/create-structure-helpers.js';
=======
import { getApiPaths, getApiEndpointQueryData } from '../utils/api.js';
>>>>>>> 669d25faed (feat: generate api v6 endpoints)

const appDirectory = dirname(fileURLToPath(import.meta.url));

export default (plop) => {
  plop.setGenerator('app', {
    description: 'Create a React app',
    prompts: [
      {
        type: 'input',
        name: 'appName',
        message: 'What is the name of the new app?',
        validate: (appName) => appName.length > 1,
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
        validate: (description) => description.length > 1,
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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 5c6f5029ff (feat(generator): update template vite js)
        type: 'checkbox',
        name: 'templates',
        message: 'What template do you want generate by default ?',
        choices: ['listing', 'dashboard', 'onboarding'],
<<<<<<< HEAD
        when: async (data) => {
          const result = await getApiv6TemplateData(data.apiPath);
=======
        type: 'list',
        name: 'listingEndpoint',
        message: 'What is the listing endpoint?',
=======
>>>>>>> 5c6f5029ff (feat(generator): update template vite js)
        when: async (data) => {
          const result = await getApiEndpointQueryData(data.apiPath);
>>>>>>> 669d25faed (feat: generate api v6 endpoints)
          // eslint-disable-next-line no-param-reassign
          data.apiV6Endpoints = result;
          return true;
        },
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 5c6f5029ff (feat(generator): update template vite js)
      },
      {
        type: 'list',
        name: 'listingEndpoint',
        message: 'What is the listing endpoint?',
        when: (data) => data.templates.includes('listing'),
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> c5c6c0b474 (feat(generator): add apiv6 requests)
        choices: async ({ apiV6Endpoints }) => {
          return apiV6Endpoints?.get?.operationList?.map(
            ({ apiPath, functionName }) => ({
              name: apiPath,
              value: functionName,
            }),
          );
        },
<<<<<<< HEAD
      },
      {
        type: 'list',
        name: 'dashboardEndpoint',
        message: 'What is the dashboard endpoint?',
        when: (data) => data.templates.includes('dashboard'),
        choices: async ({ apiV6Endpoints }) => {
          return apiV6Endpoints?.get?.operationList?.map(
            ({ apiPath, functionName }) => ({
              name: apiPath,
              value: functionName,
            }),
          );
        },
=======
        type: 'addMany',
        destination: join(appDirectory, '../../../apps/{{dashCase appName}}'),
        templateFiles: join(appDirectory, './templates/**'),
        base: join(appDirectory, './templates'),
>>>>>>> 15132344e7 (fix(generator): delete breadcrumb package + do some fixes on the)
      },
    ],
    actions: ({ apiV6Endpoints, templates, appName }) => {
      const apiFiles = createApiQueryFilesActions(apiV6Endpoints, appDirectory);
      const pages = createPages(templates, appDirectory);
      const translations = createTranslations(templates, appName, appDirectory);
=======
=======
>>>>>>> 5c6f5029ff (feat(generator): update template vite js)
        choices: async ({ apiV6Endpoints }) =>
          apiV6Endpoints.map(({ apiPath, fileName }) => ({
            name: apiPath,
            value: fileName,
          })),
=======
>>>>>>> c5c6c0b474 (feat(generator): add apiv6 requests)
      },
    ],
    actions: ({ apiV6Endpoints, templates }) => {
      const createApiQueryFilesActions = Object.entries(apiV6Endpoints).map(
        ([method, data]) => ({
          type: 'add',
          path: join(
            appDirectory,
            `../../../apps/{{dashCase appName}}/src/api/${method.toUpperCase()}/apiv6/services.ts`,
          ),
          templateFile: join(
            appDirectory,
            './conditional-templates/api/services-template.ts.hbs',
          ),
          data,
        }),
      );

<<<<<<< HEAD
>>>>>>> 669d25faed (feat: generate api v6 endpoints)
=======
      const createPages = templates.map((template) => {
        if (template === 'listing') {
          return {
            type: 'add',
            path: join(
              appDirectory,
              `../../../apps/{{dashCase appName}}/src/pages/index.tsx`,
            ),
            force: true,
            templateFile: join(
              appDirectory,
              `./conditional-templates/${template}/index.tsx.hbs`,
            ),
          };
        }
        return {
          type: 'add',
          path: join(
            appDirectory,
            `../../../apps/{{dashCase appName}}/src/pages/${template}/index.tsx`,
          ),
          templateFile: join(
            appDirectory,
            `./conditional-templates/${template}/index.tsx.hbs`,
          ),
        };
      });

>>>>>>> 5c6f5029ff (feat(generator): update template vite js)
      return [
        {
          type: 'addMany',
          destination: join(appDirectory, '../../../apps/{{dashCase appName}}'),
          templateFiles: join(appDirectory, './templates/**'),
          base: join(appDirectory, './templates'),
        },
<<<<<<< HEAD
        ...apiFiles,
        ...pages,
        ...translations,
        ({ packageName }) =>
=======
        ...createApiQueryFilesActions,
        ...createPages,
        ({ appName, packageName }) =>
>>>>>>> 669d25faed (feat: generate api v6 endpoints)
          `App ${appName} generated. Please run \n  yarn install && yarn workspace ${packageName} run start:dev`,
      ];
    },
  });
};
