import { renderHook, waitFor } from '@testing-library/react';

import { getWrapperWithShellContext } from '@/hooks/data-api/__tests__/Test.utils';

import { useCityByCode } from '../useCityByCode';

describe('useCityByCode', () => {
  it('should return the city name for the given city code', async () => {
    const { result } = renderHook(() => useCityByCode('cityCode1'), {
      wrapper: getWrapperWithShellContext(),
    });
    await waitFor(() => {
      expect(result.current?.isFetched).toBe(true);
    });
    const { data: city } = result.current;
    expect(city).toStrictEqual('cityName1');
  });
});
