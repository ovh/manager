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
import { UNIVERSES, SUB_UNIVERSES, LEVEL2 } from './universes.constant.js';

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

const apiComputed = (data) => {
  let apiV6Computed,
    apiV2Computed = {};
  if (data.mainApiPathApiVersion === 'v6') {
    apiV6Computed = {
      get: {
        ...data.apiV6Endpoints.get,
        operationList: data.apiV6Endpoints.get?.operationList?.filter(
          ({ apiPath }) =>
            [data.listingEndpointPath, data.dashboardEndpointPath].includes(
              apiPath,
            ),
        ),
      },
    };
  }
  if (data.mainApiPathApiVersion === 'v2') {
    apiV2Computed = {
      get: {
        ...data.apiV2Endpoints.get,
        operationList: data.apiV2Endpoints.get?.operationList?.filter(
          ({ apiPath }) =>
            [data.listingEndpointPath, data.dashboardEndpointPath].includes(
              apiPath,
            ) || apiPath.includes('/serviceInfos'),
        ),
      },
    };
  }
  return { apiV6Computed, apiV2Computed };
};

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
        type: 'list',
        name: 'listingEndpoint',
        message: 'What is the listing endpoint?',
        when: async (data) => {
          data.templates = ['listing', 'onboarding', 'dashboard'];
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
        choices: getApiV2AndV6GetEndpointsChoices,
      },
      {
        type: 'list',
        name: 'dashboardEndpoint',
        message: 'What is the dashboard endpoint?',
        choices: getApiV2AndV6GetEndpointsChoices,
      },
      {
        type: 'input',
        name: 'serviceKey',
        message: 'What is the service key ?',
        when: (data) => {
          data.isPCI = data.appName.indexOf('pci') > -1;
          if (data.isPCI) {
            data.pciName = data.appName.split('pci-')[1];
          }
          data.isApiV6 = data.apiV6Endpoints.get?.operationList.length > 0;
          data.isApiV2 = data.apiV2Endpoints.get?.operationList.length > 0;

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

          if (data.isPCI) {
            data.mainApiPathPci = listingPath.replace(
              data.isApiV2 ? '{projectId}' : '{serviceName}',
              '${projectId}',
            );
          }
          const [dashboardPath, dashboardFn] =
            data.dashboardEndpoint?.split('-') || [];
          data.dashboardEndpointPath = dashboardPath;
          data.dashboardEndpointFn = dashboardFn;

          const { apiV2Computed, apiV6Computed } = apiComputed(data);
          data.apiV2Computed = apiV2Computed;
          data.apiV6Computed = apiV6Computed;

          return true;
        },
        validate: (input) => input.length > 0,
      },
      {
        type: 'input',
        name: 'serviceKey',
        message: 'What is the service key in listing page ?',
        validate: (input) => input.length > 0,
      },
      {
        type: 'list',
        name: 'level2',
        message: 'What is the level2 of the app ? (tracking)',
        choices: Object.keys(LEVEL2).map((element) => ({
          name: `${element} - ${LEVEL2[element]}`,
          value: element,
        })),
      },
      {
        type: 'list',
        name: 'universe',
        message: 'What is the universe of the app ? (tracking)',
        choices: UNIVERSES.map((element) => ({
          name: element,
          value: element,
        })),
      },
      {
        type: 'list',
        name: 'subuniverse',
        message: 'What is the subuniverse of the app ? (tracking)',
        choices: SUB_UNIVERSES.map((element) => ({
          name: element,
          value: element,
        })),
      },
    ],
    actions: ({
      apiV6Endpoints,
      apiV2Endpoints,
      templates,
      appName,
      apiV6Computed,
      apiV2Computed,
      isApiV6,
    }) => {
      const apiV2Files =
        Object.keys(apiV2Endpoints).length > 0
          ? createApiQueryFilesActions({
              endpoints: apiV2Computed,
              apiVersion: 'v2',
              appDirectory,
              appName,
            })
          : [];

      const apiV6Files =
        Object.keys(apiV6Endpoints).length > 0
          ? createApiQueryFilesActions({
              endpoints: apiV6Computed,
              apiVersion: 'v6',
              appDirectory,
              appName,
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
