// src/playbook/prompts-main.test.ts
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { ApiPathChoice } from '../kernel/types/api-types';
import type { MethodGroup, PromptChoice } from '../kernel/types/inquiries-types';
/** ------------------------------- SUT ------------------------------------- */
import { buildQuestions } from './prompts-main';
import type { AugmentedAnswers, GeneratorAnswers } from './types/playbook-types';

/** ------------------------ Hoisted mocks (no closure) --------------------- */
const h = vi.hoisted(() => {
  return {
    registerPromptMock: vi.fn<(name: string, prompt: unknown) => void>(),

    prepareEndpointsForListingMock: vi.fn<(a: GeneratorAnswers) => Promise<void>>(() =>
      Promise.resolve(),
    ),
    buildEndpointChoiceValuesMock: vi.fn<
      (v2: MethodGroup | undefined, v6: MethodGroup | undefined) => string[]
    >(() => ['/cloud/project-getService']),
    // Keep these trivial to avoid unsafe member-access lints
    choicesToStringsMock: vi.fn<(choices: PromptChoice[]) => string[]>(() => []),
    normalizeApiPathChoicesMock: vi.fn<(items: ApiPathChoice[]) => PromptChoice[]>(() => []),
    isEndpointValueFormatMock: vi.fn<(s: string) => boolean>(
      (s: string) => typeof s === 'string' && s.startsWith('/'),
    ),
    applyDerivationsMock: vi.fn<(a: GeneratorAnswers) => void>(() => {}),
  };
});

vi.mock('inquirer', () => ({
  default: { registerPrompt: h.registerPromptMock },
}));

vi.mock('inquirer-autocomplete-prompt', () => ({
  default: vi.fn(),
}));

vi.mock('../kernel/prompts/prompts-helper', () => ({
  applyDerivations: h.applyDerivationsMock,
  transformPromptsChoicesToStrings: h.choicesToStringsMock,
}));

vi.mock('../kernel/utils/endpoint-utils', () => ({
  buildEndpointChoiceValues: h.buildEndpointChoiceValuesMock,
  isEndpointValueFormat: h.isEndpointValueFormatMock,
  normalizeApiPathChoices: h.normalizeApiPathChoicesMock,
  prepareEndpointsForListing: h.prepareEndpointsForListingMock,
}));

vi.mock('./config/api-config', () => ({
  REGIONS: ['EU', 'US'] as const,
  UNIVERSES: ['PublicCloud', 'WebCloud'] as const,
  SUB_UNIVERSES: ['compute', 'network'] as const,
  level2Choices: [
    { name: '56 - ManagerCloud', value: '56', short: '56' },
    { name: '57 - Something', value: '57', short: '57' },
  ] as const,
}));

/** ------------------------------ Utilities -------------------------------- */
type Answers = Partial<GeneratorAnswers> & Partial<AugmentedAnswers>;

type QuestionLite = {
  type: string;
  name: string;
  message?: string;
  validate?: (val: unknown, answers?: Answers) => true | string | Promise<true | string>;
  default?: unknown;
  filter?: (val: unknown) => unknown;
  when?: (answers: Answers) => boolean | Promise<boolean>;
  choices?: readonly unknown[] | ((answers: Answers) => readonly unknown[]);
};

function getQ(questions: readonly unknown[], name: string, type?: string): QuestionLite {
  for (const x of questions) {
    if (
      typeof x === 'object' &&
      x !== null &&
      'name' in (x as Record<string, unknown>) &&
      (x as Record<string, unknown>).name === name &&
      (!type || (x as Record<string, unknown>).type === type)
    ) {
      return x as QuestionLite;
    }
  }
  throw new Error(`Question "${name}"${type ? ` (type=${type})` : ''} not found`);
}

/** ------------------------------- Tests ----------------------------------- */
// NOTE: Do NOT clear mocks before tests; we need the import-time call history.
afterEach(() => {
  vi.clearAllMocks();
  vi.useRealTimers();
});

describe('identity & routing', function () {
  it('registers the autocomplete prompt on import', () => {
    // This is invoked by the SUT at module import time
    expect(h.registerPromptMock).toHaveBeenCalledWith('autocomplete', expect.anything());
  });

  it('exposes identity questions with validation/defaults', () => {
    const apiPaths: ApiPathChoice[] = [{ name: 'Cloud', value: '/cloud' }];
    const questions = buildQuestions(apiPaths);

    const appNameQ = getQ(questions, 'appName', 'input');
    expect(appNameQ.validate?.('')).toBe('App name is required');
    expect(appNameQ.validate?.('ok')).toBe(true);

    const packageNameQ = getQ(questions, 'packageName', 'input');
    const pkgDef = packageNameQ.default as (a: Partial<GeneratorAnswers>) => string;
    expect(pkgDef({ appName: 'zimbra' })).toBe('@ovh-ux/manager-zimbra-app');

    const descriptionQ = getQ(questions, 'description', 'input');
    expect(descriptionQ.validate?.('')).toBe('Description is required');
    expect(descriptionQ.validate?.('desc')).toBe(true);
  });

  it('handles regions/universes with validation and default', () => {
    const questions = buildQuestions([] as ApiPathChoice[]);
    const regionsQ = getQ(questions, 'regions', 'checkbox');
    const def = regionsQ.default as readonly string[];
    expect(Array.isArray(def)).toBe(true);
    expect(def).toEqual(['EU', 'US']);

    expect(regionsQ.validate?.([])).toBe('Pick at least one region');
    expect(regionsQ.validate?.(['EU'])).toBe(true);

    const universesQ = getQ(questions, 'universes', 'checkbox');
    expect(universesQ.validate?.([])).toBe('Pick at least one universe');
    expect(universesQ.validate?.(['PublicCloud'])).toBe(true);
  });
});

describe('API families & paths', function () {
  it('sets API family defaults and calls path normalizers', () => {
    const apiPaths: ApiPathChoice[] = [{ name: 'Cloud', value: '/cloud' }];
    const questions = buildQuestions(apiPaths);

    expect(getQ(questions, 'listingApi', 'list').default).toBe('v6Iceberg');
    expect(getQ(questions, 'dashboardApi', 'list').default).toBe('v6');

    // ensure normalize/choices mappers are wired
    getQ(questions, 'apiPaths', 'checkbox');
    expect(h.choicesToStringsMock).toHaveBeenCalled();
  });
});
