import { describe, it, vi } from 'vitest';

import { v6 } from '@ovh-ux/manager-core-api';

import { getAvailableRegions } from '@/api/data/available-regions';

describe('available-regions', () => {
  it('fetches available regions successfully', async () => {
    const mockData = {
      products: [
        {
          name: 'product1',
          regions: [
            { name: 'region1', type: 'type1' },
            { name: 'region2', type: 'type2' },
          ],
        },
      ],
    };
    vi.mocked(v6.get).mockResolvedValue({ data: mockData });
    const result = await getAvailableRegions('project1', 'subsidiary1', 'product1');
    expect(result).toEqual(mockData);
  });

  it('handles empty available regions response', async () => {
    const mockData = { products: [] };
    vi.mocked(v6.get).mockResolvedValue({ data: mockData });
    const result = await getAvailableRegions('project1', 'subsidiary1', 'product1');
    expect(result).toEqual(mockData);
  });

  it('handles error when fetching available regions', async () => {
    vi.mocked(v6.get).mockRejectedValue(new Error('Network Error'));
    await expect(getAvailableRegions('project1', 'subsidiary1', 'product1')).rejects.toThrow(
      'Network Error',
    );
  });

  it('fetches available regions with multiple products', async () => {
    const mockData = {
      products: [
        {
          name: 'product1',
          regions: [{ name: 'region1', type: 'type1' }],
        },
        {
          name: 'product2',
          regions: [{ name: 'region2', type: 'type2' }],
        },
      ],
    };
    vi.mocked(v6.get).mockResolvedValue({ data: mockData });
    const result = await getAvailableRegions('project1', 'subsidiary1', 'product1');
    expect(result).toEqual(mockData);
  });

  it('handles available regions with no regions', async () => {
    const mockData = {
      products: [
        {
          name: 'product1',
          regions: [],
        },
      ],
    };
    vi.mocked(v6.get).mockResolvedValue({ data: mockData });
    const result = await getAvailableRegions('project1', 'subsidiary1', 'product1');
    expect(result).toEqual(mockData);
  });
});
