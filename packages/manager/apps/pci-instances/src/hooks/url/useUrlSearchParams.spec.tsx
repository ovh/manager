import { renderHook } from '@testing-library/react';
import * as module from 'react-router-dom';
import { describe, expect, test, vi } from 'vitest';
import { useUrlSearchParams } from './useUrlSearchParams';

const fakeUrlSearchParams = new URLSearchParams('foo=bar&instance=30');
const fakeSetUrlSearchParams = vi.fn();

const mockedUseSearchParams = vi.spyOn(module, 'useSearchParams');

const expectedResult1 = {
  foo: 'bar',
  instance: '30',
};

const expectedResult2 = {
  foo: 'bar',
  test: null,
};

type Data = {
  names: string[];
  expectedResult: unknown;
};

describe('Condidering the useUrlSearchParams hook', () => {
  mockedUseSearchParams.mockReturnValue([
    fakeUrlSearchParams,
    fakeSetUrlSearchParams,
  ]);
  test.each`
    names                  | expectedResult
    ${[]}                  | ${{}}
    ${['foo', 'instance']} | ${expectedResult1}
    ${['foo', 'test']}     | ${expectedResult2}
  `(
    `When invoking the useUrlSearchParams() hook, then expect section to be <$expectedResult>`,
    ({ names, expectedResult }: Data) => {
      const { result } = renderHook(() => useUrlSearchParams(...names));
      expect(result.current).toStrictEqual(expectedResult);
    },
  );
});
