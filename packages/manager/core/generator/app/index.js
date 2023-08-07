/* eslint-disable import/extensions, no-param-reassign */
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getApiPaths } from '../utils/api.js';
import { getApiv6TemplateData } from '../utils/api-template.js';
import {
  createPages,
  createTranslations,
  createApiQueryFilesActions,
} from '../utils/create-structure-helpers.js';

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
        type: 'checkbox',
        name: 'templates',
        message: 'What template do you want generate by default ?',
        choices: ['listing', 'dashboard', 'onboarding'],
        when: async (data) => {
          const result = await getApiv6TemplateData(data.apiPath);
          data.apiV6Endpoints = result;
          return true;
        },
      },
      {
        type: 'list',
        name: 'listingEndpoint',
        message: 'What is the listing endpoint?',
        when: (data) => data.templates.includes('listing'),
        choices: async ({ apiV6Endpoints }) => {
          return apiV6Endpoints?.get?.operationList?.map(
            ({ apiPath, functionName }) => ({
              name: apiPath,
              value: functionName,
            }),
          );
        },
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
      },
      {
        type: 'input',
        name: 'pimID',
        message: 'What is the PIM ID? (leave empty for no PIM ID)',
        validate: (input) => {
          const number = Number(input);
          return !isNaN(number) && typeof number === 'number';
        },
      },
      {
        type: 'input',
        name: 'serviceKey',
        message: 'What is the service key ?',
        when: (data) => {
          // Add variables for templates
          data.hasListing = data.templates.includes('listing');
          data.hasDashboard = data.templates.includes('dashboard');
          data.hasOnboarding = data.templates.includes('onboarding');

          return data.templates.includes('listing');
        },
        validate: (input) => input.length > 0,
      },
    ],
    actions: ({ apiV6Endpoints, templates, appName }) => {
      const apiFiles = createApiQueryFilesActions(apiV6Endpoints, appDirectory);
      const pages = createPages(templates, appDirectory);
      const translations = createTranslations(templates, appName, appDirectory);
      return [
        {
          type: 'addMany',
          destination: join(appDirectory, '../../../apps/{{dashCase appName}}'),
          templateFiles: join(appDirectory, './templates/**'),
          base: join(appDirectory, './templates'),
        },
        ...apiFiles,
        ...pages,
        ...translations,
        ({ packageName }) =>
          `App ${appName} generated. Please run \n  yarn install && yarn workspace ${packageName} run start:dev`,
      ];
    },
  });
};
