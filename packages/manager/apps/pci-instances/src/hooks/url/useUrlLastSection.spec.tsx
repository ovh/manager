import { renderHook } from '@testing-library/react';
import { describe, vi } from 'vitest';
import * as module from 'react-router-dom';
import { useUrlLastSection } from './useUrlLastSection';

const fakeBasePath: module.Path = {
  pathname: '/foo/bar',
  search: '',
  hash: '',
};

const buildPathMatch = (section?: string): module.PathMatch => ({
  params: {
    section,
  },
  pathname: '',
  pathnameBase: '',
  pattern: {
    path: '',
  },
});

const mockedUseResolvedPath = vi.spyOn(module, 'useResolvedPath');
const mockedUseMatch = vi.spyOn(module, 'useMatch');

describe('Condidering the useUrlLastSection hook', () => {
  test.each`
    pathMatch                   | expectedResult
    ${buildPathMatch('foo')}    | ${null}
    ${buildPathMatch()}         | ${null}
    ${buildPathMatch('delete')} | ${'delete'}
    ${buildPathMatch('start')}  | ${'start'}
    ${buildPathMatch('stop')}   | ${'stop'}
  `(
    `When invoking the useUrlLastSection() hook, then expect section to be <$expectedResult>`,
    ({ pathMatch, expectedResult }) => {
      mockedUseResolvedPath.mockReturnValueOnce(fakeBasePath);
      mockedUseMatch.mockReturnValueOnce(pathMatch);
      const { result } = renderHook(() => useUrlLastSection());
      expect(result.current).toStrictEqual(expectedResult);
    },
  );
});
