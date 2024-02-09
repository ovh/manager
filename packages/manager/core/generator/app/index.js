/* eslint-disable import/extensions, no-param-reassign */
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getApiPaths, isV2Endpoint } from '../utils/api.js';
import { getApiTemplateData } from '../utils/api-template.js';
import {
  createPages,
  createTranslations,
  createApiQueryFilesActions,
} from '../utils/create-structure-helpers.js';

const appDirectory = dirname(fileURLToPath(import.meta.url));

const toChoice = ({ apiPath, functionName }) => ({
  name: apiPath,
  value: `${apiPath}-${functionName}`,
});

const getApiV2AndV6GetEndpointsChoices = ({
  apiV6Endpoints,
  apiV2Endpoints,
}) => [
    { type: 'separator', line: 'V2 endpoints' },
    ...(apiV2Endpoints?.get?.operationList?.map(toChoice) || []),
    { type: 'separator' },
    { type: 'separator', line: 'V6 endpoints' },
    ...(apiV6Endpoints?.get?.operationList?.map(toChoice) || []),
    { type: 'separator' },
  ];

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
        type: 'checkbox',
        name: 'apiPaths',
        message: 'Which API base route is used?',
        choices: getApiPaths,
        validate: (apiPaths) => apiPaths.length > 0,
      },
      {
        type: 'checkbox',
        name: 'templates',
        message: 'Which templates do you want to generate?',
        choices: ['listing', 'dashboard', 'onboarding'],
        when: async (data) => {
          data.apiPathsByApiVersion = data.apiPaths.reduce(
            (res, path) => {
              res[isV2Endpoint(path) ? 'v2' : 'v6'].push(path);
              return res;
            },
            { v2: [], v6: [] },
          );
          data.apiV6Endpoints = await getApiTemplateData(
            data.apiPathsByApiVersion.v6,
          );
          data.apiV2Endpoints = await getApiTemplateData(
            data.apiPathsByApiVersion.v2,
          );
          return true;
        },
      },
      {
        type: 'list',
        name: 'listingEndpoint',
        message: 'What is the listing endpoint?',
        when: (data) => data.templates.includes('listing'),
        choices: getApiV2AndV6GetEndpointsChoices,
      },
      {
        type: 'list',
        name: 'dashboardEndpoint',
        message: 'What is the dashboard endpoint?',
        when: (data) => data.templates.includes('dashboard'),
        choices: getApiV2AndV6GetEndpointsChoices,
      },
      {
        type: 'confirm',
        name: 'isGenerateAllApi',
        message: 'Would you like to generate all api related to your API base?',
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

          data.isApiV6 = data.apiV6Endpoints.get?.operationList.length

          if (data.hasListing) {
            const [listingPath, listingFn] =
              data.listingEndpoint?.split('-') || [];
            data.listingEndpointPath = listingPath;
            data.listingEndpointFn = listingFn;
            data.mainApiPath = listingPath;
            data.mainApiPathApiVersion = data.apiV2Endpoints.get?.operationList
              .map(({ apiPath }) => apiPath)
              .includes(data.mainApiPath)
              ? 'v2'
              : 'v6';
          }
          if (data.hasDashboard) {
            const [dashboardPath, dashboardFn] =
              data.dashboardEndpoint?.split('-') || [];
            data.dashboardEndpointPath = dashboardPath;
            data.dashboardEndpointFn = dashboardFn;
          }

          let apiV6Computed = {};
          if (data.mainApiPathApiVersion === 'v6') {
            apiV6Computed = data.isGenerateAllApi ? data.apiV6Endpoints : {
              get: {
                ...data.apiV6Endpoints.get,
                operationList: data.apiV6Endpoints.get?.operationList?.filter(({ apiPath }) => [data.listingEndpointPath, data.dashboardEndpointPath].includes(apiPath))
              }
            }
          }

          let apiV2Computed = {}
          if (data.mainApiPathApiVersion === 'v2') {
            apiV2Computed = data.isGenerateAllApi ? data.apiV2Endpoints : {
              get: {
                ...data.apiV2Endpoints.get,
                operationList: data.apiV2Endpoints.get?.operationList?.filter(({ apiPath }) => [data.listingEndpointPath, data.dashboardEndpointPath].includes(apiPath) || apiPath.includes('/serviceInfos'))
              }
            }
          }
          data.apiV2Computed = apiV2Computed;
          data.apiV6Computed = apiV6Computed;

          return data.hasListing;
        },
        validate: (input) => input.length > 0,
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
    actions: ({ apiV6Endpoints, apiV2Endpoints, templates, appName, apiV6Computed, apiV2Computed, isApiV6 }) => {
 
      const apiV2Files =
        Object.keys(apiV2Endpoints).length > 0
          ? createApiQueryFilesActions({
            endpoints: apiV2Computed,
            apiVersion: 'v2',
            appDirectory,
          })
          : [];

      const apiV6Files =
        Object.keys(apiV6Endpoints).length > 0
          ? createApiQueryFilesActions({
            endpoints: apiV6Computed,
            apiVersion: 'v6',
            appDirectory,
          })
          : [];
      
      const pages = createPages(templates, appDirectory, isApiV6);
      const translations = createTranslations(templates, appName, appDirectory);
      return [
        {
          type: 'addMany',
          destination: join(appDirectory, '../../../apps/{{dashCase appName}}'),
          templateFiles: join(appDirectory, './templates/**'),
          base: join(appDirectory, './templates'),
        },
        ...apiV6Files,
        ...apiV2Files,
        ...pages,
        ...translations,
        ({ packageName }) =>
          `App ${appName} generated. Please run \n  yarn install && yarn workspace ${packageName} run start:dev`,
      ].filter(Boolean);
    },
  });
};
