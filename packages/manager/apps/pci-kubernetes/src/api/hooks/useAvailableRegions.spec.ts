import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import * as ApiAvailableRegionsModule from '@/api/data/available-regions';
import { TAvailableRegionsResponse } from '@/api/data/available-regions';
import { useAvailableRegions } from '@/api/hooks/useAvailableRegions';
import { wrapper } from '@/wrapperRenders';

describe('useAvailableRegions', () => {
  it('fetches available regions successfully', async () => {
    const mockData = ({
      products: [
        {
          name: 'kubernetes',
          regions: [
            { id: 'region1', type: 'region' },
            { id: 'region2', type: 'region' },
          ],
        },
      ],
    } as unknown) as TAvailableRegionsResponse;
    vi.spyOn(
      ApiAvailableRegionsModule,
      'getAvailableRegions',
    ).mockResolvedValueOnce(mockData);
    const { result } = renderHook(() => useAvailableRegions('project1'), {
      wrapper,
    });
    // TO REWORK
    // await waitFor(() => expect(result.current.isSuccess).toBe(true));
    // expect(result.current.data).toEqual([
    //   { id: 'region1', type: 'region' },
    //   { id: 'region2', type: 'region' },
    // ]);
  });

  it('returns empty array if no regions are available', async () => {
    const mockData = {
      products: [
        {
          name: 'kubernetes',
          regions: [],
        },
      ],
    } as TAvailableRegionsResponse;
    vi.spyOn(
      ApiAvailableRegionsModule,
      'getAvailableRegions',
    ).mockResolvedValueOnce(mockData);
    const { result } = renderHook(() => useAvailableRegions('project1'), {
      wrapper,
    });
    // TO REWORK
    // await waitFor(() => expect(result.current.data).toEqual([]));
  });
});
