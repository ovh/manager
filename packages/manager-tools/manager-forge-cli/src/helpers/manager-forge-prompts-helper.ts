#!/usr/bin/env node
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
 * Extract previous answer
 */
function getPreviousAnswer<T = unknown>(
  key: keyof Answers,
  value: unknown,
  state?: Partial<Answers>,
): T | undefined {
  const prompt = value as EnquirerPromptInstance;
  return (state?.[key] ?? prompt?.state?.answers?.[key]) as T | undefined;
}

/**
 * Build question for app name.
 */
function buildAppNameQuestion(): PromptOptions<'appName'> {
  return {
    type: 'input',
    name: 'appName',
    message: 'What is the name of the new app?',
    validate: (input: unknown) =>
      (typeof input === 'string' && input.trim().length > 1) || 'App name is required',
  };
}

/**
 * Build question for package name (depends on appName).
 */
function buildPackageNameQuestion(): PromptOptions<'packageName'> {
  return {
    type: 'input',
    name: 'packageName',
    message: 'What is the packageName of the new app?',
    initial: (_value, state) => {
      const appName = getPreviousAnswer('appName', _value, state);
      return `@ovh-ux/manager-${typeof appName === 'string' ? appName : ''}-app`;
    },
  };
}

/**
 * Build question for app description.
 */
function buildDescriptionQuestion(): PromptOptions<'description'> {
  return {
    type: 'input',
    name: 'description',
    message: 'How would you describe the new app?',
    validate: (input: unknown) =>
      (typeof input === 'string' && input.trim().length > 1) || 'Description is required',
  };
}

/**
 * Build region selection question.
 */
function buildRegionQuestion(): PromptOptions<'regions'> {
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
 * Build universes multiselect question.
 */
function buildUniversesQuestion(): PromptOptions<'universes'> {
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
 * Build Level2 tracking code selection question.
 */
function buildLevel2Question(): PromptOptions<'level2'> {
  return {
    type: 'select',
    name: 'level2',
    message: 'Select Level2 tracking code',
    choices: [...level2Choices],
  };
}

/**
 * Build universe selection for tracking.
 */
function buildUniverseQuestion(): PromptOptions<'universe'> {
  return {
    type: 'select',
    name: 'universe',
    message: 'Select universe for tracking',
    choices: UNIVERSES.map((u) => ({ name: u, value: u })),
  };
}

/**
 * Build sub-universe selection for tracking.
 */
function buildSubUniverseQuestion(): PromptOptions<'subUniverse'> {
  return {
    type: 'select',
    name: 'subUniverse',
    message: 'Select sub-universe for tracking',
    choices: SUB_UNIVERSES.map((s) => ({ name: s, value: s })),
  };
}

/**
 * Ask for application information interactively.
 */
export async function askApplicationInfos(): Promise<Answers> {
  const questions: PromptOptions[] = [
    buildAppNameQuestion(),
    buildPackageNameQuestion(),
    buildDescriptionQuestion(),
    buildRegionQuestion(),
    buildUniversesQuestion(),
    buildLevel2Question(),
    buildUniverseQuestion(),
    buildSubUniverseQuestion(),
  ];

  return Enquirer.prompt<Answers>(questions);
}
