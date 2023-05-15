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
      './conditional-templates/api/services-template.ts.hbs',
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
    if (template === 'dashboard') {
      return {
        type: 'add',
        path: join(
          appDirectory,
          `../../../apps/{{dashCase appName}}/src/pages/dashboard/[serviceName]/index.tsx`,
        ),
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
      type: 'addMany',
      destination: join(
        appDirectory,
        `../../../apps/{{dashCase appName}}/src/public/translations/${appName}/${template}/`,
      ),
      templateFiles: join(
        appDirectory,
        `./conditional-translations/${template}/`,
      ),
      base: join(appDirectory, `./conditional-translations/${template}/`),
    };
  });
};

export { createPages, createTranslations, createApiQueryFilesActions };
