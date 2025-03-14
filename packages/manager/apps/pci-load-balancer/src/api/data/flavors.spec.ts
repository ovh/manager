import { describe, it, expect, vi } from 'vitest';
import { v6 } from '@ovh-ux/manager-core-api';
import { getFlavor } from './flavors';
import { TFlavor } from '@/api/data/load-balancer';
import { TProductAddonDetail } from '@/types/product.type';

describe('getFlavor', () => {
  const projectId = 'test-project';
  const regionName = 'test-region';
  const addon = ({
    technicalName: 'test-flavor',
  } as unknown) as TProductAddonDetail;

  it('should return the correct flavor', async () => {
    const mockFlavors: TFlavor[] = [
      { name: 'test-flavor', region: 'region1', id: 'id1' },
      { name: 'another-flavor', region: 'region2', id: 'id2' },
    ];

    vi.mocked(v6.get).mockResolvedValue({ data: mockFlavors });

    const result = await getFlavor(projectId, regionName);

    expect(result).toEqual(mockFlavors);
  });

  it('should handle API errors gracefully', async () => {
    vi.mocked(v6.get).mockRejectedValue(new Error('API Error'));

    await expect(getFlavor(projectId, regionName)).rejects.toThrow('API Error');
  });
});
