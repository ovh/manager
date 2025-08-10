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
    isManualValueMock: vi.fn<(v: unknown, m: string) => boolean>(
      (v: unknown, m: string) => v === m,
    ),
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
  buildEndpointChoiceValues: h.buildEndpointChoiceValuesMock,
  choicesToStrings: h.choicesToStringsMock,
  isEndpointValueFormat: h.isEndpointValueFormatMock,
  isManualValue: h.isManualValueMock,
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

vi.mock('./config/kernel-config', () => ({
  MANUAL_ENDPOINT_VALUE: '__manual__' as const,
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

async function resolveBool(x: boolean | Promise<boolean> | undefined): Promise<boolean> {
  if (typeof x === 'boolean') return x;
  if (x && typeof x.then === 'function') {
    return await x;
  }
  return false;
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

  it('sets routing defaults and derived isPci', () => {
    const questions = buildQuestions([] as ApiPathChoice[]);
    const routeFlavorQ = getQ(questions, 'routeFlavor', 'list');
    expect(routeFlavorQ.default).toBe('pci');

    const isPciQ = getQ(questions, 'isPci', 'confirm');
    const isPciDef = isPciQ.default as (a: Partial<GeneratorAnswers>) => boolean;
    expect(isPciDef({ routeFlavor: 'pci' })).toBe(true);
    expect(isPciDef({ routeFlavor: 'generic' })).toBe(false);
  });

  it('filters slug/basePrefix/serviceParam/platformParam inputs', () => {
    const questions = buildQuestions([] as ApiPathChoice[]);
    expect(getQ(questions, 'appSlug', 'input').filter?.('  foo  ')).toBe('foo');
    expect(getQ(questions, 'basePrefix', 'input').filter?.('  public-cloud  ')).toBe(
      'public-cloud',
    );
    expect(getQ(questions, 'serviceParam', 'input').filter?.(':service')).toBe('service');
    expect(getQ(questions, 'platformParam', 'input').filter?.(':platformId')).toBe('platformId');
  });
});

describe('API families & paths', function () {
  it('sets API family defaults and calls path normalizers', () => {
    const apiPaths: ApiPathChoice[] = [{ name: 'Cloud', value: '/cloud' }];
    const questions = buildQuestions(apiPaths);

    expect(getQ(questions, 'listingApi', 'list').default).toBe('v6Iceberg');
    expect(getQ(questions, 'onboardingApi', 'list').default).toBe('v6');

    // ensure normalize/choices mappers are wired
    getQ(questions, 'apiPaths', 'checkbox');
    expect(h.normalizeApiPathChoicesMock).toHaveBeenCalled();
    expect(h.choicesToStringsMock).toHaveBeenCalled();
  });

  it('prepares endpoints before listing and builds choices with MANUAL appended when missing', async () => {
    const questions = buildQuestions([] as ApiPathChoice[]);
    const listingEndpointQ = getQ(questions, 'listingEndpoint', 'list');

    const whenRes = listingEndpointQ.when?.({} as Answers);
    expect(await resolveBool(whenRes)).toBe(true);
    expect(h.prepareEndpointsForListingMock).toHaveBeenCalled();

    // helper returns without manual -> SUT appends
    h.buildEndpointChoiceValuesMock.mockReturnValueOnce(['/cloud/x-get']);
    const choicesFn1 = listingEndpointQ.choices as (a: Answers) => readonly unknown[];
    const c1 = choicesFn1({ apiV2Endpoints: {}, apiV6Endpoints: {} } as Answers);
    expect(c1).toEqual(['/cloud/x-get', '__manual__']);

    // helper includes manual -> unchanged
    h.buildEndpointChoiceValuesMock.mockReturnValueOnce(['/cloud/y-get', '__manual__']);
    const choicesFn2 = listingEndpointQ.choices as (a: Answers) => readonly unknown[];
    const c2 = choicesFn2({ apiV2Endpoints: {}, apiV6Endpoints: {} } as Answers);
    expect(c2).toEqual(['/cloud/y-get', '__manual__']);
  });
});

describe('manual inputs, derivations & tracking', function () {
  it('shows manual endpoint inputs when MANUAL is selected, validates and trims', () => {
    const questions = buildQuestions([] as ApiPathChoice[]);

    const manualListingQ = getQ(questions, 'listingEndpoint', 'input');
    const manualOnboardingQ = getQ(questions, 'onboardingEndpoint', 'input');

    expect(manualListingQ.when?.({ listingEndpoint: '__manual__' } as Answers)).toBe(true);
    expect(manualOnboardingQ.when?.({ onboardingEndpoint: '__manual__' } as Answers)).toBe(true);

    expect(manualListingQ.validate?.('not/starting/with-slash')).toBe(
      'Please use /api/path-functionName (e.g. /cloud/project-getService)',
    );
    expect(h.isEndpointValueFormatMock).toHaveBeenCalled();

    expect(manualListingQ.validate?.('/cloud/project-getService')).toBe(true);
    expect(manualListingQ.filter?.('   /cloud/x-y   ')).toBe('/cloud/x-y');
  });

  it('applies derivations before serviceKey and validates presence', () => {
    const questions = buildQuestions([] as ApiPathChoice[]);
    const serviceKeyQ = getQ(questions, 'serviceKey', 'input');

    expect(serviceKeyQ.when?.({} as Answers)).toBe(true);
    expect(h.applyDerivationsMock).toHaveBeenCalled();

    expect(serviceKeyQ.validate?.('')).toBe('Service key is required');
    expect(serviceKeyQ.validate?.('ok')).toBe(true);
  });

  it('exposes tracking questions with configured choices', () => {
    const questions = buildQuestions([] as ApiPathChoice[]);
    expect(getQ(questions, 'level2', 'list').choices).toEqual([
      { name: '56 - ManagerCloud', value: '56', short: '56' },
      { name: '57 - Something', value: '57', short: '57' },
    ]);
    expect(getQ(questions, 'universe', 'list').choices).toEqual(['PublicCloud', 'WebCloud']);
    expect(getQ(questions, 'subUniverse', 'list').choices).toEqual(['compute', 'network']);
  });
});
