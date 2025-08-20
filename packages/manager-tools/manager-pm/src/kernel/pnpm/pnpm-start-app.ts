import concurrently from 'concurrently';
import inquirer from 'inquirer';
import inquirerSearchList from 'inquirer-search-list';

import { containerPackageName } from '../../playbook/pnpm-config.js';
import { getApplicationId, getApplications } from '../commons/workspace-utils.js';
import { PromptAnswers, Questions } from '../types/commons/prompts-types.js';
import { Application } from '../types/commons/workspace-type.js';

/**
 * Prompt the user to select an application, region, and container option,
 * then start the application using Turbo.
 *
 * @returns A promise resolving when the selected application has been started.
 */
// eslint-disable-next-line max-lines-per-function
export async function startApp(): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  inquirer.registerPrompt('search-list', inquirerSearchList);

  const questions: Questions<PromptAnswers> = [
    {
      type: 'list',
      name: 'packageName',
      message: 'Which application do you want to start?',
      choices: getApplications,
    },
    {
      type: 'list',
      name: 'region',
      message: 'Please specify the region:',
      choices: (answers: PromptAnswers) => {
        const app: Application | undefined = getApplications().find(
          ({ value }) => value === answers.packageName,
        );
        if (!app?.regions) {
          throw new Error(`No regions found in ${answers.packageName} package.json`);
        }
        return app.regions;
      },
    },
    {
      type: 'confirm',
      name: 'container',
      message: 'Start the application inside the container?',
      default: true,
      when: (answers: PromptAnswers) => answers.packageName !== containerPackageName,
    },
  ];

  const {
    packageName,
    region = 'EU',
    container = false,
  } = await inquirer.prompt<PromptAnswers>(questions);

  process.env.REGION = region;

  if (!packageName) {
    throw new Error('No application selected.');
  }

  if (container) {
    const appId = await getApplicationId(packageName);
    concurrently(
      [
        `VITE_CONTAINER_APP=${appId} turbo run start --filter=${containerPackageName}`,
        `CONTAINER=1 turbo run start --filter=${packageName}`,
      ],
      { raw: true },
    );
  } else {
    concurrently([`turbo run start --filter=${packageName}`], {
      raw: true,
    });
  }
}
