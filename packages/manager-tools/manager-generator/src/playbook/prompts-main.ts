/**
 * @file prompts-main.ts
 * @description Old-generator parity prompts (TypeScript, lint-clean).
 */
import inquirer from 'inquirer';
import autocomplete from 'inquirer-autocomplete-prompt';

import { MANUAL_ENDPOINT_VALUE } from '../kernel/config/kernel-constants';
import {
  applyDerivations,
  buildEndpointChoiceValues,
  choicesToStrings,
  isEndpointValueFormat,
  normalizeApiPathChoices,
  prepareEndpointsForListing,
} from '../kernel/prompts/prompts-helper';
import { ApiPathChoice } from '../kernel/types/api-types';
import { Questions } from '../kernel/types/inquiries-types';
import { LEVEL2, REGIONS, SUB_UNIVERSES, UNIVERSES } from './config/api-static-data';
import type { AugmentedAnswers, GeneratorAnswers } from './types/playbook-types';

inquirer.registerPrompt('autocomplete', autocomplete as never);

/**
 * Build all questions in the same order as the legacy generator.
 * Uses small helpers to keep lint (max-lines/complexity) happy.
 */
// eslint-disable-next-line max-lines-per-function
export function buildQuestions(apiPaths: ApiPathChoice[]): Questions {
  return [
    // Identity
    {
      type: 'input',
      name: 'appName',
      message: 'What is the name of the new app?',
      validate: (input: unknown) =>
        (typeof input === 'string' && input.trim().length > 1) || 'App name is required',
    },
    {
      type: 'input',
      name: 'packageName',
      message: 'What is the packageName of the new app?',
      default: ({ appName }: Partial<GeneratorAnswers>) => `@ovh-ux/manager-${appName}-app`,
    },
    {
      type: 'input',
      name: 'description',
      message: 'How would you describe the new app?',
      validate: (input: unknown) =>
        (typeof input === 'string' && input.trim().length > 1) || 'Description is required',
    },

    // Regions & universes
    {
      type: 'checkbox',
      name: 'regions',
      message: 'what are the regions of the new app ?',
      choices: REGIONS,
      validate: (value: unknown) =>
        (Array.isArray(value) && value.length > 0) || 'Pick at least one region',
      default: REGIONS,
    },
    {
      type: 'checkbox',
      name: 'universes',
      message: 'what are the universes of the new app ?',
      choices: UNIVERSES,
      validate: (value: unknown) =>
        (Array.isArray(value) && value.length > 0) || 'Pick at least one universe',
    },

    // API base paths (converted to plain string values)
    {
      type: 'checkbox',
      name: 'apiPaths',
      message: 'Which API base route is used?',
      choices: choicesToStrings(normalizeApiPathChoices(apiPaths)),
      validate: (value: unknown) =>
        (Array.isArray(value) && value.length > 0) || 'Pick at least one API path',
    },

    // Endpoints (listing first, then dashboard). Prepare data right before listing.
    {
      type: 'list',
      name: 'listingEndpoint',
      message: 'What is the listing endpoint?',
      when: async (answers: Partial<GeneratorAnswers>) => {
        await prepareEndpointsForListing(answers as GeneratorAnswers);
        return true;
      },
      choices: (answers: Partial<GeneratorAnswers>) => {
        const values = buildEndpointChoiceValues(
          (answers as AugmentedAnswers).apiV2Endpoints,
          (answers as AugmentedAnswers).apiV6Endpoints,
        );

        // Ensure there is exactly one manual option, and no duplicates overall
        const withManual = values.includes(MANUAL_ENDPOINT_VALUE)
          ? values
          : [...values, MANUAL_ENDPOINT_VALUE];

        return Array.from(new Set(withManual));
      },
    },
    // If user picked manual, ask for the value and overwrite the same answer key
    {
      type: 'input',
      name: 'listingEndpoint',
      message:
        'Type the listing endpoint value (format: /api/path-functionName, e.g. /cloud/project-getService):',
      when: (answers: Partial<GeneratorAnswers>) =>
        answers.listingEndpoint === MANUAL_ENDPOINT_VALUE,
      validate: (input: unknown) =>
        (typeof input === 'string' && isEndpointValueFormat(input)) ||
        'Please use /api/path-functionName (e.g. /cloud/project-getService)',
    },

    {
      type: 'list',
      name: 'dashboardEndpoint',
      message: 'What is the dashboard endpoint?',
      choices: (answers: Partial<GeneratorAnswers>) => {
        const values = buildEndpointChoiceValues(
          (answers as AugmentedAnswers).apiV2Endpoints,
          (answers as AugmentedAnswers).apiV6Endpoints,
        );

        // Ensure there is exactly one manual option, and no duplicates overall
        const withManual = values.includes(MANUAL_ENDPOINT_VALUE)
          ? values
          : [...values, MANUAL_ENDPOINT_VALUE];

        return Array.from(new Set(withManual));
      },
    },
    {
      type: 'input',
      name: 'dashboardEndpoint',
      message:
        'Type the dashboard endpoint value (format: /api/path-functionName, e.g. /cloud/project-getService):',
      when: (answers: Partial<GeneratorAnswers>) =>
        answers.dashboardEndpoint === MANUAL_ENDPOINT_VALUE,
      validate: (input: unknown) =>
        (typeof input === 'string' && isEndpointValueFormat(input)) ||
        'Please use /api/path-functionName (e.g. /cloud/project-getService)',
    },

    // Service keys (legacy had two prompts; we keep parity)
    {
      type: 'input',
      name: 'serviceKey',
      message: 'What is the service key ?',
      when: (answers: Partial<GeneratorAnswers>) => {
        applyDerivations(answers as GeneratorAnswers); // sets flags and computed groups
        return true;
      },
      validate: (input: unknown) =>
        (typeof input === 'string' && input.trim().length > 0) || 'Service key is required',
    },
    {
      type: 'input',
      name: 'serviceKey',
      message: 'What is the service key in listing page ?',
      validate: (input: unknown) =>
        (typeof input === 'string' && input.trim().length > 0) || 'Service key is required',
    },

    // Tracking (same order/labels)
    {
      type: 'list',
      name: 'level2',
      message: 'What is the level2 of the app ? (tracking)',
      choices: Object.keys(LEVEL2),
    },
    {
      type: 'list',
      name: 'universe',
      message: 'What is the universe of the app ? (tracking)',
      choices: UNIVERSES,
    },
    {
      type: 'list',
      name: 'subUniverse', // correct casing
      message: 'What is the subuniverse of the app ? (tracking)',
      choices: SUB_UNIVERSES,
    },
  ];
}
