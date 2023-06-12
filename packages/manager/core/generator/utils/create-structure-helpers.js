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
  if (!templates.length) {
    // no template selected
    return [
      {
        type: 'add',
        path: join(
          appDirectory,
          '../../../apps/{{dashCase appName}}/e2e/home.test.ts',
        ),
        force: true,
        templateFile: join(
          appDirectory,
          `./conditional-templates/default/home.test.ts.hbs`,
        ),
      },
    ];
  }
  return templates.flatMap((template) => {
    if (template === 'listing') {
      return [
        {
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
        },
        {
          type: 'add',
          path: join(
            appDirectory,
            '../../../apps/{{dashCase appName}}/e2e/home.test.ts',
          ),
          force: true,
          templateFile: join(
            appDirectory,
            `./conditional-templates/${template}/listing.test.ts.hbs`,
          ),
        },
      ];
    }
    if (template === 'dashboard') {
      return [
        {
          type: 'add',
          path: join(
            appDirectory,
            `../../../apps/{{dashCase appName}}/src/pages/dashboard/[serviceName]/index.tsx`,
          ),
          templateFile: join(
            appDirectory,
            `./conditional-templates/${template}/index.tsx.hbs`,
          ),
        },
        {
          type: 'add',
          path: join(
            appDirectory,
            `../../../apps/{{dashCase appName}}/e2e/dashboard.test.ts`,
          ),
          templateFile: join(
            appDirectory,
            `./conditional-templates/${template}/dashboard.test.ts.hbs`,
          ),
        },
      ];
    }
    return [
      {
        type: 'add',
        path: join(
          appDirectory,
          `../../../apps/{{dashCase appName}}/src/pages/${template}/index.tsx`,
        ),
        templateFile: join(
          appDirectory,
          `./conditional-templates/${template}/index.tsx.hbs`,
        ),
      },
      {
        type: 'add',
        path: join(
          appDirectory,
          `../../../apps/{{dashCase appName}}/e2e/${template}.test.ts`,
        ),
        templateFile: join(
          appDirectory,
          `./conditional-templates/${template}/${template}.test.ts.hbs`,
        ),
      },
    ];
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
        `./conditional-translations/${template}/Messages_fr_FR.json`,
      ),
    };
  });
};

export { createPages, createTranslations, createApiQueryFilesActions };