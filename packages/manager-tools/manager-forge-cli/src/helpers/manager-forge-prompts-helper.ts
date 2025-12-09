import Enquirer from 'enquirer';
import type { PromptOptions } from 'enquirer';

import {
  REGIONS,
  SUB_UNIVERSES,
  UNIVERSES,
  level2Choices,
} from '@/configs/manager-forge-prompts-config.js';
import type { Answers } from '@/types/PromptType.js';

type EnquirerPromptInstance = { state?: { answers?: Record<string, unknown> } };

/**
 * Extracts the previous answer for a given key.
 *
 * @template T
 * @param {keyof Answers} key - The key for which to retrieve a stored answer.
 * @param {unknown} value - The raw Enquirer internal value.
 * @param {Partial<Answers>} [state] - Current prompt state containing previous answers.
 * @returns {T | undefined} - The extracted previous answer if available.
 */
export function getPreviousAnswer<T = unknown>(
  key: keyof Answers,
  value: unknown,
  state?: Partial<Answers>,
): T | undefined {
  const prompt = value as EnquirerPromptInstance;
  return (state?.[key] ?? prompt?.state?.answers?.[key]) as T | undefined;
}

/**
 * Builds a generic name question (e.g., app name, module name).
 *
 * @template T
 * @param {{ key: T, label: string }} params
 * @returns {PromptOptions<T>}
 */
export function buildNameQuestion<T extends string>({
  key,
  label,
}: {
  key: T;
  label: string;
}): PromptOptions<T> {
  return {
    type: 'input',
    name: key,
    message: `What is the name of the new ${label}?`,
    validate: (input: unknown) =>
      (typeof input === 'string' && input.trim().length > 1) || `${label} name is required`,
  };
}

/**
 * Builds a generic description question.
 *
 * @template T
 * @param {{ key: T, label: string }} params
 * @returns {PromptOptions<T>}
 */
export function buildDescriptionQuestion<T extends string>({
  key,
  label,
}: {
  key: T;
  label: string;
}): PromptOptions<T> {
  return {
    type: 'input',
    name: key,
    message: `How would you describe the new ${label}?`,
    validate: (input: unknown) =>
      (typeof input === 'string' && input.trim().length > 1) ||
      `Description for ${label} is required`,
  };
}

/**
 * Builds a generic package name question.
 * Automatically derives the package name based on the name field.
 *
 * @template T
 * @param {{
 *   key: T,
 *   nameKey: keyof Answers,
 *   label: string,
 *   prefix: string
 * }} params
 * @returns {PromptOptions<T>}
 */
export function buildPackageNameQuestion<T extends string>({
  key,
  nameKey,
  label,
  prefix,
  suffix,
}: {
  key: T;
  nameKey: keyof Answers;
  label: string;
  prefix: string;
  suffix?: string;
}): PromptOptions<T> {
  return {
    type: 'input',
    name: key,
    message: `What is the package name of the new ${label}?`,
    initial: (_value, state) => {
      const name = getPreviousAnswer<string>(nameKey, _value, state);
      const packageSuffix = suffix && name?.length && !name?.endsWith(suffix) ? `-${suffix}` : '';
      return `@ovh-ux/${prefix}-${typeof name === 'string' ? name : ''}${packageSuffix}`;
    },
  };
}

/**
 * Builds region selection question.
 *
 * @returns {PromptOptions<'regions'>}
 */
export function buildRegionQuestion(): PromptOptions<'regions'> {
  return {
    type: 'multiselect',
    name: 'regions',
    message: 'Select regions',
    choices: REGIONS.map((region) => ({ name: region, value: region })),
    validate: (value: unknown) =>
      Array.isArray(value) && value.length > 0 ? true : 'Pick at least one region',
  };
}

/**
 * Builds universes multiselect question.
 *
 * @returns {PromptOptions<'universes'>}
 */
export function buildUniversesQuestion(): PromptOptions<'universes'> {
  return {
    type: 'multiselect',
    name: 'universes',
    message: 'Select universes',
    choices: UNIVERSES.map((universe) => ({ name: universe, value: universe })),
    validate: (value: unknown) =>
      Array.isArray(value) && value.length > 0 ? true : 'Pick at least one universe',
  };
}

/**
 * Builds Level2 tracking code question.
 *
 * @returns {PromptOptions<'level2'>}
 */
export function buildLevel2Question(): PromptOptions<'level2'> {
  return {
    type: 'select',
    name: 'level2',
    message: 'Select Level2 tracking code',
    choices: [...level2Choices],
  };
}

/**
 * Builds universe tracking select question.
 *
 * @returns {PromptOptions<'universe'>}
 */
export function buildUniverseQuestion(): PromptOptions<'universe'> {
  return {
    type: 'select',
    name: 'universe',
    message: 'Select universe for tracking',
    choices: UNIVERSES.map((universe) => ({ name: universe, value: universe })),
  };
}

/**
 * Builds sub-universe tracking question.
 *
 * @returns {PromptOptions<'subUniverse'>}
 */
export function buildSubUniverseQuestion(): PromptOptions<'subUniverse'> {
  return {
    type: 'select',
    name: 'subUniverse',
    message: 'Select sub-universe for tracking',
    choices: SUB_UNIVERSES.map((subUniverse) => ({ name: subUniverse, value: subUniverse })),
  };
}

/**
 * Ask for application information interactively.
 *
 * @returns {Promise<Answers>}
 */
export async function askApplicationInfos(): Promise<Answers> {
  const questions: PromptOptions[] = [
    buildNameQuestion({ key: 'appName', label: 'app' }),
    buildPackageNameQuestion({
      key: 'packageName',
      nameKey: 'appName',
      label: 'app',
      prefix: 'manager',
      suffix: 'app',
    }),
    buildDescriptionQuestion({ key: 'description', label: 'app' }),
    buildRegionQuestion(),
    buildUniversesQuestion(),
    buildLevel2Question(),
    buildUniverseQuestion(),
    buildSubUniverseQuestion(),
  ];

  return Enquirer.prompt<Answers>(questions);
}

/**
 * Builds the "isPrivate" boolean question.
 *
 * @returns {PromptOptions<'isPrivate'>}
 */
export function buildModulePrivateQuestion(): PromptOptions<'isPrivate'> {
  return {
    type: 'confirm',
    name: 'isPrivate',
    message: 'Is the module private?',
    initial: () => true,
  };
}

/**
 * Builds the module type question (React or Node).
 *
 * @returns {PromptOptions<'moduleType'>}
 */
export function buildModuleTypeQuestion(): PromptOptions<'moduleType'> {
  return {
    type: 'select',
    name: 'moduleType',
    message: 'What type of module is it?',
    choices: [
      { name: 'React (frontend)', value: 'react' },
      { name: 'Node (backend/pure JS)', value: 'node' },
    ],
    initial: () => 0,
    result: (value) => {
      const found = ['react', 'node'].find(
        (option) => typeof value === 'string' && value.toLowerCase().includes(option),
      );
      return found ?? value;
    },
  };
}

/**
 * Ask for module information interactively.
 *
 * @returns {Promise<{
 *   moduleName: string;
 *   modulePackageName: string;
 *   moduleDescription: string;
 *   isPrivate: boolean;
 *   moduleType: "react" | "node";
 *   hasTranslations: boolean;
 * }>}
 */
export async function askModuleInfos() {
  const questions: PromptOptions[] = [
    buildNameQuestion({ key: 'moduleName', label: 'module' }),
    buildPackageNameQuestion({
      key: 'modulePackageName',
      nameKey: 'moduleName',
      label: 'module',
      prefix: 'manager',
    }),
    buildDescriptionQuestion({
      key: 'moduleDescription',
      label: 'module',
    }),
    buildModulePrivateQuestion(),
    buildModuleTypeQuestion(),
  ];

  return Enquirer.prompt(questions);
}
