import { renderHook } from '@testing-library/react';
import { describe, vi } from 'vitest';
import * as module from 'react-router-dom';
import { useUrlLastSection } from './useUrlLastSection';

const mockedUseLocation = vi.spyOn(module, 'useLocation');
const fakePredicateRegex = /^(delete|start)$/;
const fakePredicateFn = (section: string) => fakePredicateRegex.test(section);

const buildLocation = (pathname: string): module.Location<null> => ({
  pathname,
  state: null,
  key: 'fakeKey',
  search: '',
  hash: '',
});

describe('Condidering the useUrlLastSection hook', () => {
  afterEach(() => {
    mockedUseLocation.mockClear();
  });
  test.each`
    location                            | predicateFn        | expectedResult
    ${buildLocation('/')}               | ${undefined}       | ${null}
    ${buildLocation('/foo/bar')}        | ${undefined}       | ${'bar'}
    ${buildLocation('/foo/bar')}        | ${() => false}     | ${null}
    ${buildLocation('/foo/bar/delete')} | ${fakePredicateFn} | ${'delete'}
  `(
    `When invoking the useUrlLastSection() hook with optional predicate function, then expect section to be <$expectedResult>`,
    ({ location, expectedResult, predicateFn }) => {
      mockedUseLocation.mockReturnValueOnce(location);
      const { result } = renderHook(() => useUrlLastSection(predicateFn), {
        wrapper: module.HashRouter,
      });
      expect(result.current).toStrictEqual(expectedResult);
    },
  );
});
