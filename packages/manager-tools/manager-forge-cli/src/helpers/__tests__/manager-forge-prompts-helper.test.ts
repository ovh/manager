import type { PromptOptions } from 'enquirer';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  REGIONS,
  SUB_UNIVERSES,
  UNIVERSES,
  level2Choices,
} from '@/configs/manager-forge-prompts-config.js';
import type { Answers } from '@/types/PromptType.js';

type PromptsModule = typeof import('../manager-forge-prompts-helper.js');

const enquirerPromptMock = vi.fn();

vi.mock('enquirer', () => ({
  default: {
    prompt: enquirerPromptMock,
  },
}));

let promptsModule: PromptsModule;

beforeEach(async () => {
  vi.clearAllMocks();
  vi.resetModules();

  // Re-import the module so it sees our mocked 'enquirer'
  promptsModule = await import('../manager-forge-prompts-helper.js');
});

describe('askApplicationInfos', () => {
  it('builds the expected questions and returns Enquirer answers', async () => {
    const fakeAnswers: Answers = {
      appName: 'my-app',
      packageName: '@ovh-ux/manager-my-app-app',
      description: 'My new Manager app',
      regions: ['EU', 'US'],
      universes: ['Dedicated', 'Manager'],
      level2: '56',
      universe: 'WebCloud',
      subUniverse: 'Sunrise',
    };

    enquirerPromptMock.mockResolvedValueOnce(fakeAnswers);

    const result = await promptsModule.askApplicationInfos();

    expect(enquirerPromptMock).toHaveBeenCalledTimes(1);

    const firstCall = enquirerPromptMock.mock.calls[0];
    expect(firstCall).toBeDefined();

    const [questionsArg] = firstCall as [unknown];
    expect(Array.isArray(questionsArg)).toBe(true);

    const questions = questionsArg as PromptOptions[];

    const byName = (name: keyof Answers) => questions.find((q) => q.name === name) as PromptOptions;

    const appNameQ = byName('appName');
    expect(appNameQ.type).toBe('input');
    expect(appNameQ.message).toContain('name of the new app');

    const appNameValidate = appNameQ.validate as (input: unknown) => boolean | string;

    expect(appNameValidate('')).toBe('App name is required');
    expect(appNameValidate('a')).toBe('App name is required');
    expect(appNameValidate('my-app')).toBe(true);

    const packageNameQ = byName('packageName');
    expect(packageNameQ.type).toBe('input');

    const packageInitial = packageNameQ.initial as (
      value: unknown,
      state?: Partial<Answers>,
    ) => string;

    const initialWithState = packageInitial(undefined, { appName: 'billing' });
    expect(initialWithState).toBe('@ovh-ux/manager-billing-app');

    const promptValue = {
      state: {
        answers: {
          appName: 'dedicated',
        },
      },
    };

    const initialFromPrompt = packageInitial(promptValue, undefined);
    expect(initialFromPrompt).toBe('@ovh-ux/manager-dedicated-app');

    const descriptionQ = byName('description');
    expect(descriptionQ.type).toBe('input');

    const descriptionValidate = descriptionQ.validate as (input: unknown) => boolean | string;

    expect(descriptionValidate('')).toBe('Description is required');
    expect(descriptionValidate('a')).toBe('Description is required');
    expect(descriptionValidate('A useful new app')).toBe(true);

    const regionsQ = byName('regions');
    expect(regionsQ.type).toBe('multiselect');

    type Choice = { name: string; value: string };
    const regionsChoices = (regionsQ as PromptOptions & { choices: Choice[] }).choices;

    expect(Array.isArray(regionsChoices)).toBe(true);
    expect(regionsChoices).toEqual(REGIONS.map((r) => ({ name: r, value: r })));

    const regionsValidate = regionsQ.validate as (value: unknown) => boolean | string;

    expect(regionsValidate([])).toBe('Pick at least one region');
    expect(regionsValidate(['EU'])).toBe(true);
    expect(regionsValidate('not-array')).toBe('Pick at least one region');

    const universesQ = byName('universes');
    expect(universesQ.type).toBe('multiselect');

    const universesChoices = (universesQ as PromptOptions & { choices: Choice[] }).choices;

    expect(universesChoices).toEqual(UNIVERSES.map((u) => ({ name: u, value: u })));

    const universesValidate = universesQ.validate as (value: unknown) => boolean | string;

    expect(universesValidate([])).toBe('Pick at least one universe');
    expect(universesValidate(['WebCloud'])).toBe(true);
    expect(universesValidate('nope')).toBe('Pick at least one universe');

    const level2Q = byName('level2');
    expect(level2Q.type).toBe('select');

    const level2ChoicesFromPrompt = (level2Q as PromptOptions & { choices: unknown[] }).choices;

    expect(Array.isArray(level2ChoicesFromPrompt)).toBe(true);
    expect(level2ChoicesFromPrompt).toEqual(level2Choices);

    const universeQ = byName('universe');
    expect(universeQ.type).toBe('select');

    const universeChoices = (universeQ as PromptOptions & { choices: Choice[] }).choices;

    expect(universeChoices).toEqual(UNIVERSES.map((u) => ({ name: u, value: u })));

    const subUniverseQ = byName('subUniverse');
    expect(subUniverseQ.type).toBe('select');

    const subUniverseChoices = (subUniverseQ as PromptOptions & { choices: Choice[] }).choices;

    expect(subUniverseChoices).toEqual(SUB_UNIVERSES.map((s) => ({ name: s, value: s })));

    expect(result).toBe(fakeAnswers);
  });
});
