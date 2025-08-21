/**
 * @file prompts-main.ts
 * @description Old-generator parity prompts (TypeScript, lint-clean) with routing + API family support.
 */
import inquirer from 'inquirer';
import autocomplete from 'inquirer-autocomplete-prompt';

import {
  applyDerivations,
  isManualInputPrompt,
  transformPromptsChoicesToStrings,
} from '../kernel/prompts/prompts-helper';
import { ApiPathChoice } from '../kernel/types/api-types';
import { Questions } from '../kernel/types/inquiries-types';
import {
  buildEndpointChoiceValues,
  isEndpointValueFormat,
  prepareEndpointsForListing,
} from '../kernel/utils/endpoint-utils';
import { normalizeApiPathChoices } from '../kernel/utils/paths-utils';
import { REGIONS, SUB_UNIVERSES, UNIVERSES, level2Choices } from './config/api-config';
import { MANUAL_ENDPOINT_VALUE } from './config/kernel-config';
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

    /* ------------------------ Regions & universes ------------------------ */
    {
      type: 'checkbox',
      name: 'regions',
      message: 'what are the regions of the new app ?',
      choices: [...REGIONS],
      validate: (value: unknown) =>
        (Array.isArray(value) && value.length > 0) || 'Pick at least one region',
      default: REGIONS.slice(), // clone for Inquirer
    },
    {
      type: 'checkbox',
      name: 'universes',
      message: 'what are the universes of the new app ?',
      choices: [...UNIVERSES],
      validate: (value: unknown) =>
        (Array.isArray(value) && value.length > 0) || 'Pick at least one universe',
    },

    /* --------------------------- Routing section ------------------------- */
    {
      type: 'list',
      name: 'routeFlavor',
      message: 'What routing flavor?',
      choices: [
        { name: 'PCI (/pci/projects/:projectId/<slug>)', value: 'pci' },
        { name: 'Generic (/<slug>)', value: 'generic' },
        { name: 'Platform param (/:platformId)', value: 'platformParam' },
      ],
      default: 'pci',
    },

    {
      type: 'confirm',
      name: 'isPci',
      message: 'Is this a PCI app?',
      default: ({ routeFlavor }: Partial<GeneratorAnswers>): boolean => routeFlavor === 'pci',
    },

    {
      type: 'input',
      name: 'appSlug',
      message: 'Optional app slug (kebab-case). Leave empty to derive from app name.',
      default: '',
      filter: (val: unknown) => (typeof val === 'string' ? val.trim() : ''),
    },
    {
      type: 'input',
      name: 'basePrefix',
      message:
        'Optional shell namespace prefix (e.g., "public-cloud"). Leave empty to auto-detect in container.',
      default: '',
      filter: (val: unknown) => (typeof val === 'string' ? val.trim() : ''),
    },
    {
      type: 'input',
      name: 'serviceParam',
      message: 'Service route param name (without ":")',
      default: 'serviceName',
      filter: (val: unknown) =>
        typeof val === 'string' ? val.trim().replace(/^:/, '') : 'serviceName',
    },
    {
      type: 'input',
      name: 'platformParam',
      message: 'Platform route param name (without ":")',
      default: 'platformId',
      filter: (val: unknown) =>
        typeof val === 'string' ? val.trim().replace(/^:/, '') : 'platformId',
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
      name: 'onboardingApi',
      message: 'Which API family for ONBOARDING?',
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

    /* ---- Endpoints (listing first, then onboarding). Prepare before list. ---- */
    {
      type: 'list',
      name: 'listingEndpoint',
      message: 'What is the listing endpoint?',
      when: async (answers: Partial<GeneratorAnswers>) => {
        await prepareEndpointsForListing(answers as GeneratorAnswers);
        return true;
      },
      choices: (answers: Partial<GeneratorAnswers>) => {
        const listingChoicesValues = buildEndpointChoiceValues(
          (answers as AugmentedAnswers).apiV2Endpoints,
          (answers as AugmentedAnswers).apiV6Endpoints,
        );
        return listingChoicesValues.includes(MANUAL_ENDPOINT_VALUE)
          ? listingChoicesValues
          : [...listingChoicesValues, MANUAL_ENDPOINT_VALUE];
      },
    },
    {
      type: 'list',
      name: 'onboardingEndpoint',
      message: 'What is the onboarding endpoint?',
      when: async (answers: Partial<GeneratorAnswers>) => {
        await prepareEndpointsForListing(answers as GeneratorAnswers);
        return true;
      },
      choices: (answers: Partial<GeneratorAnswers>) => {
        const listingChoicesValues = buildEndpointChoiceValues(
          (answers as AugmentedAnswers).apiV2Endpoints,
          (answers as AugmentedAnswers).apiV6Endpoints,
        );
        return listingChoicesValues.includes(MANUAL_ENDPOINT_VALUE)
          ? listingChoicesValues
          : [...listingChoicesValues, MANUAL_ENDPOINT_VALUE];
      },
    },

    /* ---- Endpoints Input If No List. ---- */
    {
      type: 'input',
      name: 'listingEndpoint',
      message:
        'Type the listing endpoint value (format: /api/path-functionName, e.g. /cloud/project-getService):',
      when: (answers: Partial<GeneratorAnswers>) =>
        isManualInputPrompt(
          (answers as Record<string, unknown>).listingEndpoint,
          MANUAL_ENDPOINT_VALUE,
        ),
      validate: (input: unknown) =>
        (typeof input === 'string' && isEndpointValueFormat(input)) ||
        'Please use /api/path-functionName (e.g. /cloud/project-getService)',
      filter: (input: unknown) => (typeof input === 'string' ? input.trim() : ''),
    },
    {
      type: 'input',
      name: 'onboardingEndpoint',
      message:
        'Type the onboarding endpoint value (format: /api/path-functionName, e.g. /cloud/project-getService):',
      when: (answers: Partial<GeneratorAnswers>) =>
        isManualInputPrompt(
          (answers as Record<string, unknown>).onboardingEndpoint,
          MANUAL_ENDPOINT_VALUE,
        ),
      validate: (input: unknown) =>
        (typeof input === 'string' && isEndpointValueFormat(input)) ||
        'Please use /api/path-functionName (e.g. /cloud/project-getService)',
      filter: (input: unknown) => (typeof input === 'string' ? input.trim() : ''),
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
