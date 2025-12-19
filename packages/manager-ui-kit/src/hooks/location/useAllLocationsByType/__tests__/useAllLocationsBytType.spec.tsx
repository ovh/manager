import { renderHook, waitFor } from '@testing-library/react';

import { getWrapperWithShellContext } from '@/hooks/data-api/__tests__/Test.utils';
import { locations1AZ } from '@/hooks/location/__mocks__/location';

import { useAllLocationsByType } from '../useAllLocationsByType';
import { LocationType } from '../useAllLocationsByType.type';

describe('useAllLocationsByType', () => {
  it('should return locations matching the given type', async () => {
    const { result } = renderHook(() => useAllLocationsByType(LocationType['1AZ']), {
      wrapper: getWrapperWithShellContext(),
    });
    await waitFor(() => {
      expect(result.current?.isFetched).toBe(true);
    });
    const { data: allLocations } = result.current;
    expect(allLocations).toStrictEqual(locations1AZ);
  });
});
