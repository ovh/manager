import inquirer from 'inquirer';

import { getApiPaths } from '../kernel/api/api-main';
import { buildQuestions } from './prompts-main';
import { GeneratorAnswers } from './types/playbook-types';

/**
 * Prompt the user for generator answers (exported default).
 */
export default async function askQuestions(): Promise<GeneratorAnswers> {
  const apiPaths = await getApiPaths();
  const questions = buildQuestions(apiPaths);
  return inquirer.prompt<GeneratorAnswers>(questions);
}
