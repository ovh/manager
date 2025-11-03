import { renderHook, waitFor } from '@testing-library/react';

import { getWrapperWithShellContext } from '@/hooks/data-api/__tests__/Test.utils';
import { location3 } from '@/hooks/location/__mocks__/location';

import { useLocationByName } from '../useLocationByName';

describe('useLocationByName', () => {
  it('should return the location for the given name', async () => {
    const { result } = renderHook(() => useLocationByName('name3'), {
      wrapper: getWrapperWithShellContext(),
    });
    await waitFor(() => {
      expect(result.current?.isFetched).toBe(true);
    });
    const { data: location } = result.current;
    expect(location).toStrictEqual(location3);
  });
});
