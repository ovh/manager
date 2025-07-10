import { describe, test, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import * as reactRouterDom from 'react-router-dom';
import { useParam } from './useParam';

describe('useParam hook', () => {
  const useParamsMock = vi.spyOn(reactRouterDom, 'useParams');

  test.each([
    [
      'returns all requested params',
      { fooId: '42', barId: '7' },
      ['fooId', 'barId'],
      { fooId: '42', barId: '7' },
      null,
    ],
    [
      'throws when a required param is missing',
      { fooId: '42' },
      ['fooId', 'barId'],
      null,
      'Missing "barId" in URL.',
    ],
    [
      'throws when all params are missing',
      {},
      ['fooId'],
      null,
      'Missing "fooId" in URL.',
    ],
  ])(
    '%s',
    (_label, mockedParams, requestedParams, expectedResult, expectedError) => {
      useParamsMock.mockReturnValue(mockedParams);

      if (expectedError) {
        expect(() => {
          renderHook(() => useParam(...requestedParams));
        }).toThrow(expectedError);
      } else {
        const { result } = renderHook(() => useParam(...requestedParams));
        expect(result.current).toEqual(expectedResult);
      }
    },
  );
});
