import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { useGetFlavor } from './useFlavors';
import { getFlavors } from '@/api/data/flavors';
import { wrapper } from '@/wrapperRenders';
import { TFlavor } from '../data/load-balancer';
import { TProductAddonDetail } from '@/types/product.type';

vi.mock('@/api/data/flavors');

describe('useGetFlavor', () => {
  const projectId = 'test-project';
  const regionName = 'test-region';
  const addon = {
    size: 'test-addon',
    technicalName: 'flavor-data',
  } as TProductAddonDetail;

  it('should fetch flavor data successfully', async () => {
    const mockFlavorData = {
      name: 'flavor-data',
      region: 'region1',
      id: 'id1',
    } as TFlavor;
    vi.mocked(getFlavors).mockResolvedValueOnce([mockFlavorData]);

    const { result } = renderHook(
      () => useGetFlavor(projectId, regionName, addon),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockFlavorData);
    expect(getFlavors).toHaveBeenCalledWith(projectId, regionName);
  });
});
