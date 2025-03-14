import { renderHook } from '@testing-library/react';
import * as module from 'react-router-dom';
import { vi } from 'vitest';
import { usePathMatch } from './usePathMatch';

const mockedUseLocation = vi.spyOn(module, 'useLocation');

describe('Considering the usePathMatch hook', () => {
  test.each`
    pathname          | regex         | expectedResult
    ${'/foo/bar'}     | ${/foo/}      | ${'foo'}
    ${'/foo/bar'}     | ${/bar/}      | ${'bar'}
    ${'/foo/bar'}     | ${/baz/}      | ${null}
    ${'/foo/bar/baz'} | ${/foo\/bar/} | ${'foo/bar'}
    ${'/foo/bar/baz'} | ${/bar\/baz/} | ${'bar/baz'}
  `(
    `When pathname is '$pathname' and regex is '$regex', then expect result to be '$expectedResult'`,
    ({ pathname, regex, expectedResult }) => {
      mockedUseLocation.mockReturnValue({ pathname } as module.Location);

      const { result } = renderHook(() => usePathMatch(regex));

      expect(result.current).toBe(expectedResult);
    },
  );
});
