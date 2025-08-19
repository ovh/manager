import type * as inquirer from 'inquirer';

/**
 * Prompt answers type.
 */
export interface PromptAnswers {
  packageName?: string;
  region?: string;
  container?: boolean;
  type?: string;
}

/**
 * Wrap inquirer.Question so we don’t have to import it everywhere.
 */
export type Questions<T extends inquirer.Answers = inquirer.Answers> =
  inquirer.DistinctQuestion<T>[];
