import { describe, expect, it, vi } from 'vitest';
import { fetchIcebergV6, IcebergFetchResultV6 } from '@ovh-ux/manager-core-api';
import { getProjectRegions } from './regions';

describe('getProjectRegions', () => {
  it('returns project regions data successfully', async () => {
    const mockData = [
      {
        name: 'region1',
        type: 'public',
        status: 'available',
        continentCode: 'EU',
        services: [
          {
            name: 'service1',
            status: 'active',
            endpoint: 'https://service1.endpoint',
          },
        ],
        datacenterLocation: 'location1',
      },
    ];
    vi.mocked(fetchIcebergV6).mockResolvedValueOnce({
      data: mockData,
    } as IcebergFetchResultV6<unknown>);
    const result = await getProjectRegions('projectId');
    expect(result).toEqual(mockData);
  });

  it('throws an error when API call fails', async () => {
    const errorMessage = 'Network Error';
    vi.mocked(fetchIcebergV6).mockRejectedValueOnce(new Error(errorMessage));
    await expect(getProjectRegions('projectId')).rejects.toThrow(errorMessage);
  });

  it('returns empty array when no regions are available', async () => {
    const mockData = [];
    vi.mocked(fetchIcebergV6).mockResolvedValueOnce({
      data: mockData,
    } as IcebergFetchResultV6<unknown>);
    const result = await getProjectRegions('projectId');
    expect(result).toEqual(mockData);
  });
});
