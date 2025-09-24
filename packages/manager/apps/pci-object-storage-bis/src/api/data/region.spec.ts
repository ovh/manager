import { describe, it, expect, vi } from 'vitest';
import { v6 } from '@ovh-ux/manager-core-api';
import { getRegion } from './region';

vi.mock('@ovh-ux/manager-core-api', () => ({
  v6: {
    get: vi.fn(),
  },
}));

describe('getRegion', () => {
  const projectId = 'test-project-id';
  const region = 'test-region';
  const mockRegionData = {
    continentCode: 'EU',
    datacenterLocation: 'France',
    ipCountries: ['FR'],
    name: 'GRA',
    services: [
      { name: 'compute', status: 'UP', endpoint: 'https://example.com' },
    ],
    status: 'UP',
    type: 'region',
  };

  it('should fetch region data successfully', async () => {
    vi.mocked(v6.get).mockResolvedValueOnce({ data: mockRegionData });

    const result = await getRegion(projectId, region);

    expect(v6.get).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/region/${region}`,
    );
    expect(result).toEqual(mockRegionData);
  });

  it('should handle errors when fetching region data', async () => {
    const errorMessage = 'Network Error';
    vi.mocked(v6.get).mockRejectedValueOnce(new Error(errorMessage));

    await expect(getRegion(projectId, region)).rejects.toThrow(errorMessage);
  });
});
