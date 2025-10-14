import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, vi } from 'vitest';

import * as ApiFlavorModule from '@/api/data/flavors';
import { useRegionFlavors } from '@/api/hooks/flavors';
import { wrapper } from '@/wrapperRenders';

describe('useRegionFlavors', () => {
  it('fetches region flavors successfully', async () => {
    const mockData = [{ id: 'flavor1', name: 'Flavor 1', ram: 2048, disk: 20, vcpus: 2 }];
    vi.spyOn(ApiFlavorModule, 'getRegionFlavors').mockResolvedValueOnce(mockData);
    const { result } = renderHook(() => useRegionFlavors('project1', 'region1'), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockData);
  });

  it('not fetch flavors without regions', async () => {
    const { result } = renderHook(() => useRegionFlavors('project1'), {
      wrapper,
    });
    await waitFor(() => expect(result.current.isPending).toBe(true));
    expect(result.current.data).toEqual(undefined);
    expect(result.current.error).toEqual(null);
  });
});
