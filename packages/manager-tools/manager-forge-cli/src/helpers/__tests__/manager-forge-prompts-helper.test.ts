import Enquirer from 'enquirer';
import { Mock, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  LEVEL2_CODES,
  LEVEL2_LABELS,
  REGIONS,
  SUB_UNIVERSES,
  UNIVERSES,
} from '@/configs/manager-forge-prompts-config.js';
import type { Answers } from '@/types/PromptType.js';

import {
  askApplicationInfos,
  askModuleInfos,
  buildDescriptionQuestion,
  buildLevel2Question,
  buildNameQuestion,
  buildPackageNameQuestion,
  buildRegionQuestion,
  buildSubUniverseQuestion,
  buildUniverseQuestion,
  buildUniversesQuestion,
  getPreviousAnswer,
} from '../manager-forge-prompts-helper.js';

vi.mock('enquirer', () => ({
  default: {
    prompt: vi.fn(),
  },
}));

const enquirerPromptMock = Enquirer.prompt as unknown as Mock;

const emptyPromptState: Partial<Answers> = {};

describe('getPreviousAnswer', () => {
  it('returns the value from the explicit state argument', () => {
    const storedState = { appName: 'my-app' } satisfies Partial<Answers>;
    const extracted = getPreviousAnswer('appName', {}, storedState);
    expect(extracted).toBe('my-app');
  });

  it('returns the value stored inside Enquirer prompt internal state', () => {
    const enquirerInternalValue = {
      state: { answers: { description: 'hello' } },
    };
    const extracted = getPreviousAnswer('description', enquirerInternalValue);
    expect(extracted).toBe('hello');
  });

  it('returns undefined if nothing is stored anywhere', () => {
    const extracted = getPreviousAnswer('regions', {});
    expect(extracted).toBeUndefined();
  });
});

describe('buildNameQuestion', () => {
  const nameQuestion = buildNameQuestion({ key: 'appName', label: 'app' });

  it('creates a question with the correct structure', () => {
    expect(nameQuestion.type).toBe('input');
    expect(nameQuestion.name).toBe('appName');
  });

  it('validates minimum length correctly', () => {
    expect(nameQuestion.validate?.('', emptyPromptState)).toBe('app name is required');
    expect(nameQuestion.validate?.('a', emptyPromptState)).toBe('app name is required');
    expect(nameQuestion.validate?.('ab', emptyPromptState)).toBe(true);
  });
});

describe('buildDescriptionQuestion', () => {
  const descriptionQuestion = buildDescriptionQuestion({
    key: 'description',
    label: 'module',
  });

  it('validates minimum description length', () => {
    expect(descriptionQuestion.validate?.('', emptyPromptState)).toBe(
      'Description for module is required',
    );
    expect(descriptionQuestion.validate?.('a', emptyPromptState)).toBe(
      'Description for module is required',
    );
    expect(descriptionQuestion.validate?.('valid description', emptyPromptState)).toBe(true);
  });
});

describe('buildPackageNameQuestion', () => {
  const packageNameQuestion = buildPackageNameQuestion({
    key: 'packageName',
    nameKey: 'appName',
    label: 'app',
    prefix: 'manager',
    suffix: 'app',
  });

  const resolveInitialPackageName = packageNameQuestion.initial as (
    value: unknown,
    state?: Partial<Answers>,
  ) => string;

  it('generates a package name from the previously entered app name', () => {
    const generated = resolveInitialPackageName(undefined, { appName: 'foo' });
    expect(generated).toBe('@ovh-ux/manager-foo-app');
  });

  it('does not duplicate the suffix if already present in the name', () => {
    const generated = resolveInitialPackageName(undefined, { appName: 'foo-app' });
    expect(generated).toBe('@ovh-ux/manager-foo-app');
  });

  it('generates a prefix only when no name was provided', () => {
    const generated = resolveInitialPackageName(undefined, {});
    expect(generated).toBe('@ovh-ux/manager-');
  });
});

describe('buildRegionQuestion', () => {
  const regionQuestion = buildRegionQuestion();

  it('requires at least one region to be selected', () => {
    expect(regionQuestion.validate?.([], emptyPromptState)).toBe('Pick at least one region');
    expect(regionQuestion.validate?.([REGIONS[0]], emptyPromptState)).toBe(true);
  });

  it('exposes all region choices', () => {
    if (regionQuestion.type === 'multiselect') {
      expect(regionQuestion.choices).toHaveLength(REGIONS.length);
    } else {
      throw new Error('Expected multiselect type');
    }
  });
});

describe('buildUniversesQuestion', () => {
  const universesQuestion = buildUniversesQuestion();

  it('requires at least one universe', () => {
    expect(universesQuestion.validate?.([], emptyPromptState)).toBe('Pick at least one universe');
    expect(universesQuestion.validate?.(['Manager'], emptyPromptState)).toBe(true);
  });
});

describe('buildUniverseQuestion', () => {
  const universeQuestion = buildUniverseQuestion();

  it('lists all available universes', () => {
    if (universeQuestion.type === 'select') {
      expect(universeQuestion.choices).toHaveLength(UNIVERSES.length);
    } else {
      throw new Error('Expected select type');
    }
  });
});

describe('buildSubUniverseQuestion', () => {
  const subUniverseQuestion = buildSubUniverseQuestion();

  it('lists all sub-universes', () => {
    if (subUniverseQuestion.type === 'select') {
      expect(subUniverseQuestion.choices).toHaveLength(SUB_UNIVERSES.length);
    } else {
      throw new Error('Expected select type');
    }
  });
});

describe('buildLevel2Question', () => {
  const level2Question = buildLevel2Question();

  it('includes every Level2 code with the correct label', () => {
    if (level2Question.type !== 'select') {
      throw new Error('Expected select type');
    }

    const choiceList =
      typeof level2Question.choices === 'function'
        ? level2Question.choices(emptyPromptState)
        : level2Question.choices;

    expect(choiceList).toHaveLength(LEVEL2_CODES.length);

    for (const code of LEVEL2_CODES) {
      const matchingChoice = choiceList.find((choice) => choice.value === code);
      expect(matchingChoice?.name).toContain(LEVEL2_LABELS[code]);
    }
  });
});

describe('askApplicationInfos', () => {
  beforeEach(() => {
    enquirerPromptMock.mockReset();
  });

  it('returns a fully typed Answers object', async () => {
    const mockedAnswers: Answers = {
      appName: 'myapp',
      packageName: '@ovh-ux/manager-myapp-app',
      description: 'desc',
      regions: ['EU'],
      universes: ['Manager'],
      level2: '56',
      universe: 'Manager',
      subUniverse: 'Manager',
    };

    enquirerPromptMock.mockResolvedValue(mockedAnswers);

    const collectedAnswers = await askApplicationInfos();
    expect(collectedAnswers).toEqual(mockedAnswers);

    // Type guarantee
    const typedResult: Answers = collectedAnswers;
    expect(typedResult.appName).toBe('myapp');
  });
});

describe('askModuleInfos', () => {
  beforeEach(() => {
    enquirerPromptMock.mockReset();
  });

  it('returns module-specific fields with correct types', async () => {
    const mockedModuleAnswers = {
      moduleName: 'alpha',
      modulePackageName: '@ovh-ux/manager-alpha',
      moduleDescription: 'module desc',
      isPrivate: true,
      moduleType: 'react',
    };

    enquirerPromptMock.mockResolvedValue(mockedModuleAnswers);

    const collected = await askModuleInfos();

    expect(collected.moduleName).toBe('alpha');
    expect(collected.moduleType).toBe('react');
    expect(typeof collected.isPrivate).toBe('boolean');
  });
});
