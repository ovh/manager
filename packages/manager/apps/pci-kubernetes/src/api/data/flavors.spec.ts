import { describe, it, vi } from 'vitest';
import { v6 } from '@ovh-ux/manager-core-api';
import { getRegionFlavors } from '@/api/data/flavors';

describe('getRegionFlavors', () => {
  it('fetches region flavors successfully', async () => {
    const mockData = [
      { id: 'flavor1', name: 'Flavor 1', ram: 2048, disk: 20, vcpus: 2 },
    ];
    vi.mocked(v6.get).mockResolvedValue({ data: mockData });
    const result = await getRegionFlavors('project1', 'region1');
    expect(result).toEqual(mockData);
  });

  it('handles empty region flavors response', async () => {
    const mockData = [];
    vi.mocked(v6.get).mockResolvedValue({ data: mockData });
    const result = await getRegionFlavors('project1', 'region1');
    expect(result).toEqual(mockData);
  });

  it('handles error when fetching region flavors', async () => {
    vi.mocked(v6.get).mockRejectedValue(new Error('Network Error'));
    await expect(getRegionFlavors('project1', 'region1')).rejects.toThrow(
      'Network Error',
    );
  });

  it('fetches region flavors with multiple flavors', async () => {
    const mockData = [
      { id: 'flavor1', name: 'Flavor 1', ram: 2048, disk: 20, vcpus: 2 },
      { id: 'flavor2', name: 'Flavor 2', ram: 4096, disk: 40, vcpus: 4 },
    ];
    vi.mocked(v6.get).mockResolvedValue({ data: mockData });
    const result = await getRegionFlavors('project1', 'region1');
    expect(result).toEqual(mockData);
  });

  it('handles region flavors with missing optional fields', async () => {
    const mockData = [
      {
        id: 'flavor1',
        name: 'Flavor 1',
        ram: 2048,
        disk: 20,
        vcpus: 2,
        planCodes: {},
      },
    ];
    vi.mocked(v6.get).mockResolvedValue({ data: mockData });
    const result = await getRegionFlavors('project1', 'region1');
    expect(result).toEqual(mockData);
  });
});
