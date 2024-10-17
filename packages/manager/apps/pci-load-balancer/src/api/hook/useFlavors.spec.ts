import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { useGetFlavor } from './useFlavors';
import { getFlavor } from '@/api/data/flavors';
import { TAddon } from '@/pages/create/store';
import { wrapper } from '@/wrapperRenders';
import { TFlavor } from '../data/load-balancer';

vi.mock('@/api/data/flavors');

describe('useGetFlavor', () => {
  const projectId = 'test-project';
  const regionName = 'test-region';
  const addon = { code: 'test-addon' } as TAddon;

  it('should fetch flavor data successfully', async () => {
    const mockFlavorData = {
      name: 'flavor-data',
      region: 'region1',
      id: 'id1',
    } as TFlavor;
    vi.mocked(getFlavor).mockResolvedValueOnce(mockFlavorData);

    const { result } = renderHook(
      () => useGetFlavor(projectId, regionName, addon),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockFlavorData);
    expect(getFlavor).toHaveBeenCalledWith(projectId, regionName, addon);
  });
});
