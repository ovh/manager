/* eslint-disable import/extensions */
import { join } from 'node:path';

/**
 * Copy all api files in conditional-translations/api
 * into src/api/**
 * Corresponding to the api used by apiv6
 */
export const createApiQueryFilesActions = ({
  endpoints,
  apiVersion,
  appDirectory,
}) =>
  Object.entries(endpoints).map(([method, data]) => ({
    type: 'add',
    path: join(
      appDirectory,
      `../../../apps/{{dashCase appName}}/src/api/${method.toUpperCase()}/api${apiVersion}/services.ts`,
    ),
    templateFile: join(
      appDirectory,
      `./conditional-templates/api/services-template${
        method.toUpperCase() === 'GET' ? '-get' : ''
      }.ts.hbs`,
    ),
    data: { ...data, apiVersion },
  }));

/**
 * Copy all templates files in conditional-templates
 * into app/pages folder
 * Corresponding to the template selected
 * We use the listing as home page
 */
export const createPages = (templates, appDirectory, isApiV6) =>
  templates.map((template) =>
    template === 'listing'
      ? {
          type: 'add',
          path: join(
            appDirectory,
            `../../../apps/{{dashCase appName}}/src/pages/listing/index.tsx`,
          ),
          force: true,
          templateFile: join(
            appDirectory,
            `./conditional-templates/${template}/${
              isApiV6
                ? 'index-api-v6-pagination-step'
                : 'index-api-v2-pagination-cursor'
            }.tsx.hbs`,
          ),
        }
      : {
          type: 'addMany',
          destination: join(
            appDirectory,
            `../../../apps/{{dashCase appName}}/src/pages/${template}/`,
          ),
          templateFiles: join(
            appDirectory,
            `./conditional-templates/${template}`,
          ),
          base: join(appDirectory, `./conditional-templates/${template}`),
        },
  );

/**
 * Copy all translations files in conditional-translations
 * into public/translations/appName/**
 * Corresponding to the template selected
 */
export const createTranslations = (templates, appName, appDirectory) =>
  templates.map((template) => ({
    type: 'add',
    path: join(
      appDirectory,
      `../../../apps/{{dashCase appName}}/public/translations/${template}/Messages_fr_FR.json`,
    ),
    templateFile: join(
      appDirectory,
      `./conditional-translations/${template}/Messages_fr_FR.json.hbs`,
    ),
  }));
