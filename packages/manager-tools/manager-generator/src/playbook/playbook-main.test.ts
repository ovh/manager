// src/playbook/playbook-main.test.ts
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { ApiPathChoice } from '../kernel/types/api-types';
import type { Questions } from '../kernel/types/inquiries-types';
/** ------------------------------- SUT ----------------------------------- */
import askQuestions from './playbook-main';
import type { GeneratorAnswers } from './types/playbook-types';

/** ------------------------ Hoisted data & mocks ------------------------- */
const h = vi.hoisted(() => {
  const apiPaths: ApiPathChoice[] = [{ name: 'Cloud', value: '/cloud' }];

  // Provide a mutable Questions array (not readonly) to satisfy the real signature.
  const questions: Questions = [
    { name: 'appName', type: 'input', message: 'What is the name of the new app?' },
  ];

  const answers = {} as unknown as GeneratorAnswers;

  const getApiPathsMock = vi.fn<() => Promise<ApiPathChoice[]>>(() => Promise.resolve(apiPaths));

  const buildQuestionsMock = vi.fn<(paths: ApiPathChoice[]) => Questions>(() => questions);

  // Non-async (returns a Promise) and typed to avoid require-await & unsafe-return
  const promptMock = vi.fn(() => Promise.resolve(answers)) as (
    q: unknown,
  ) => Promise<GeneratorAnswers>;

  return { apiPaths, questions, answers, getApiPathsMock, buildQuestionsMock, promptMock };
});

/** ----------------------------- Module mocks ---------------------------- */
vi.mock(
  '../kernel/api/api-main',
  () =>
    ({
      getApiPaths: h.getApiPathsMock,
    }) satisfies Partial<typeof import('../kernel/api/api-main')>,
);

vi.mock(
  './prompts-main',
  () =>
    ({
      buildQuestions: h.buildQuestionsMock,
    }) satisfies Partial<typeof import('./prompts-main')>,
);

// Minimal typed surface for inquirer default export
type InquirerMock = { default: { prompt: (q: unknown) => Promise<GeneratorAnswers> } };
vi.mock('inquirer', () => {
  const m: InquirerMock = { default: { prompt: h.promptMock } };
  return m;
});

/** ------------------------------ Cleanup -------------------------------- */
afterEach(() => {
  vi.clearAllMocks();
});

/** -------------------------------- Tests -------------------------------- */
describe('askQuestions()', function () {
  it('gets API paths, builds questions, prompts, and returns typed answers', async () => {
    const result = await askQuestions();

    // Flow & wiring
    expect(h.getApiPathsMock).toHaveBeenCalledTimes(1);
    expect(h.buildQuestionsMock).toHaveBeenCalledTimes(1);
    expect(h.buildQuestionsMock).toHaveBeenCalledWith(h.apiPaths);
    expect(h.promptMock).toHaveBeenCalledTimes(1);
    expect(h.promptMock).toHaveBeenCalledWith(h.questions);

    // Result is exactly what inquirer resolved
    expect(result).toBe(h.answers);
  });
});
