const path = require('path');

module.exports = (plop) => {
  plop.setGenerator('app', {
    description: 'Create a React app',
    prompts: [
      {
        type: 'input',
        name: 'appName',
        message: 'What is the application name?',
      },
      {
        type: 'input',
        name: 'packageName',
        message: 'What will be the application package name?',
        default: ({ appName }) => {
          return `@ovh-ux/manager-${appName}-app`;
        },
      },
      {
        type: 'input',
        name: 'description',
        message: 'Short description of the app:',
      },
    ],
    actions: [
      {
        type: 'addMany',
        destination: path.join(
          process.cwd(),
          './packages/manager/apps/{{dashCase appName}}',
        ),
        templateFiles: path.join(
          process.cwd(),
          './packages/manager/core/generator/app/templates/**',
        ),
        base: path.join(
          process.cwd(),
          './packages/manager/core/generator/app/templates',
        ),
      },
      ({ appName, packageName }) =>
        `App ${appName} generated. Please run \n  yarn install && yarn workspace ${packageName} run dev`,
    ],
  });
};
