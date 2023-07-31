/* eslint-disable import/extensions */
import { join } from 'node:path';

/**
 * Copy all api files in conditional-translations/api
 * into src/api/**
 * Corresponding to the api used by apiv6
 */
const createApiQueryFilesActions = (apiV6Endpoints, appDirectory) => {
  return Object.entries(apiV6Endpoints).map(([method, data]) => ({
    type: 'add',
    path: join(
      appDirectory,
      `../../../apps/{{dashCase appName}}/src/api/${method.toUpperCase()}/apiv6/services.ts`,
    ),
    templateFile: join(
      appDirectory,
      `./conditional-templates/api/services-template${
        method.toUpperCase() === 'GET' ? '-get' : ''
      }.ts.hbs`,
    ),
    data,
  }));
};

/**
 * Copy all templates files in conditional-templates
 * into app/pages folder
 * Corresponding to the template selected
 */
const createPages = (templates, appDirectory) => {
  return templates.map((template) => {
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
      type: 'addMany',
      destination: join(
        appDirectory,
        `../../../apps/{{dashCase appName}}/src/pages/${template}/`,
      ),
      templateFiles: join(appDirectory, `./conditional-templates/${template}`),
      base: join(appDirectory, `./conditional-templates/${template}`),
    };
  });
};

/**
 * Copy all translations files in conditional-translations
 * into public/translations/appName/**
 * Corresponding to the template selected
 */
const createTranslations = (templates, appName, appDirectory) => {
  return templates.map((template) => {
    return {
      type: 'add',
      path: join(
        appDirectory,
        `../../../apps/{{dashCase appName}}/src/public/translations/${appName}/${template}/Messages_fr_FR.json`,
      ),
      templateFile: join(
        appDirectory,
        `./conditional-translations/${template}/Messages_fr_FR.json.hbs`,
      ),
    };
  });
};

export { createPages, createTranslations, createApiQueryFilesActions };
