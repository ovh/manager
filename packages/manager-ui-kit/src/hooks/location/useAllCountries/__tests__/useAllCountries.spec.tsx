import { renderHook, waitFor } from '@testing-library/react';

import { getWrapperWithShellContext } from '@/hooks/data-api/__tests__/Test.utils';

import { useAllCountries } from '../useAllCountries';

describe('useAllCountries', () => {
  it('should return all distinct countries for the available locations', async () => {
    const { result } = renderHook(() => useAllCountries(), {
      wrapper: getWrapperWithShellContext(),
    });
    await waitFor(() => {
      expect(result.current?.isFetched).toBe(true);
    });
    const { data: countries } = result.current;
    expect(countries).toStrictEqual([
      { code: 'countryCode1', name: 'countryName1' },
      { code: 'countryCode2', name: 'countryName2' },
      { code: 'countryCode3', name: 'countryName3' },
    ]);
  });
});
