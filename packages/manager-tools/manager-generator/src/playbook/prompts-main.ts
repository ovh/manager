/**
 * @file prompts-main.ts
 * @description Old-generator parity prompts (TypeScript, lint-clean) with routing + API family support.
 */
import inquirer from 'inquirer';
import autocomplete from 'inquirer-autocomplete-prompt';

import {
  applyDerivations,
  transformPromptsChoicesToStrings,
} from '../kernel/prompts/prompts-helper';
import { ApiPathChoice } from '../kernel/types/api-types';
import { Questions } from '../kernel/types/inquiries-types';
import {
  buildEndpointChoiceValues,
  prepareEndpointsForListing,
} from '../kernel/utils/endpoint-utils';
import { normalizeApiPathChoices } from '../kernel/utils/paths-utils';
import { REGIONS, SUB_UNIVERSES, UNIVERSES, level2Choices } from './config/api-config';
import type { AugmentedAnswers, GeneratorAnswers } from './types/playbook-types';

inquirer.registerPrompt('autocomplete', autocomplete as never);

/**
 * Build all questions in the same order as the legacy generator, with added
 * routing and API family controls required by the new templates.
 */
// eslint-disable-next-line max-lines-per-function
export function buildQuestions(apiPaths: ApiPathChoice[]): Questions {
  return [
    /* ------------------------------ Identity ------------------------------ */
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

    /* --------------------------- Routing section ------------------------- */
    {
      type: 'confirm',
      name: 'isPci',
      message: 'Is this a PCI app?',
      default: false,
    },
    {
      type: 'input',
      name: 'appSlug',
      message: 'Optional app slug (kebab-case). Leave empty to derive from app name.',
      default: '',
      filter: (val: unknown) => (typeof val === 'string' ? val.trim() : ''),
    },

    /* ------------------------ Regions & universes ------------------------ */
    {
      type: 'checkbox',
      name: 'regions',
      message: 'What are the regions of the new app ?',
      choices: [...REGIONS],
      validate: (value: unknown) =>
        (Array.isArray(value) && value.length > 0) || 'Pick at least one region',
      default: REGIONS.slice(), // clone for Inquirer
    },
    {
      type: 'checkbox',
      name: 'universes',
      message: 'What are the universes of the new app ?',
      choices: [...UNIVERSES],
      validate: (value: unknown) =>
        (Array.isArray(value) && value.length > 0) || 'Pick at least one universe',
    },

    /* --------------------------- API family pick ------------------------- */
    {
      type: 'list',
      name: 'listingApi',
      message: 'Which API family for LISTING?',
      choices: [
        { name: 'Iceberg v6 (recommended)', value: 'v6Iceberg' },
        { name: 'v6', value: 'v6' },
        { name: 'v2', value: 'v2' },
      ],
      default: 'v6Iceberg',
    },
    {
      type: 'list',
      name: 'dashboardApi',
      message: 'Which API family for DASHBOARD?',
      choices: [
        { name: 'v6 (default)', value: 'v6' },
        { name: 'v2', value: 'v2' },
      ],
      default: 'v6',
    },

    /* -------------------- API base paths (legacy parity) ----------------- */
    {
      type: 'checkbox',
      name: 'apiPaths',
      message: 'Which API base route is used?',
      choices: transformPromptsChoicesToStrings(normalizeApiPathChoices(apiPaths)),
      validate: (value: unknown) =>
        (Array.isArray(value) && value.length > 0) || 'Pick at least one API path',
    },

    /* ---- Endpoints (listing first, then dashboard). Prepare before list. ---- */
    {
      type: 'list',
      name: 'listingEndpoint',
      message: 'What is the listing endpoint?',
      when: async (answers: Partial<GeneratorAnswers>) => {
        await prepareEndpointsForListing(answers as GeneratorAnswers);
        return true;
      },
      choices: (answers: Partial<GeneratorAnswers>) => {
        return buildEndpointChoiceValues(
          (answers as AugmentedAnswers).apiV2Endpoints,
          (answers as AugmentedAnswers).apiV6Endpoints,
        );
      },
    },
    {
      type: 'list',
      name: 'dashboardEndpoint',
      message: 'What is the dashboard endpoint?',
      when: async (answers: Partial<GeneratorAnswers>) => {
        await prepareEndpointsForListing(answers as GeneratorAnswers);
        return true;
      },
      choices: (answers: Partial<GeneratorAnswers>) => {
        return buildEndpointChoiceValues(
          (answers as AugmentedAnswers).apiV2Endpoints,
          (answers as AugmentedAnswers).apiV6Endpoints,
        );
      },
    },

    /* ------------------------ Service keys (parity) ----------------------- */
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

    /* ----------------------------- Tracking ------------------------------ */
    {
      type: 'list',
      name: 'level2',
      message: 'What is the level2 of the app ? (tracking)',
      choices: level2Choices,
    },
    {
      type: 'list',
      name: 'universe',
      message: 'What is the universe of the app ? (tracking)',
      choices: [...UNIVERSES],
    },
    {
      type: 'list',
      name: 'subUniverse',
      message: 'What is the subuniverse of the app ? (tracking)',
      choices: [...SUB_UNIVERSES],
    },
  ];
}
