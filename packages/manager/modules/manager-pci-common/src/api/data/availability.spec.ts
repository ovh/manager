import { describe, expect, it, vi } from 'vitest';
import { v6 } from '@ovh-ux/manager-core-api';
import { getProductAvailability } from './availability';

describe('getProductAvailability', () => {
  it('returns product availability data successfully', async () => {
    const mockData = {
      plans: [
        {
          code: 'plan1',
          regions: [
            {
              continentCode: 'EU',
              datacenter: 'datacenter1',
              enabled: true,
              name: 'region1',
              type: 'region',
            },
          ],
        },
      ],
      products: [
        {
          name: 'product1',
          regions: [
            {
              continentCode: 'EU',
              datacenter: 'datacenter1',
              enabled: true,
              name: 'region1',
              type: 'region',
            },
          ],
        },
      ],
    };
    vi.mocked(v6.get).mockResolvedValueOnce({ data: mockData });
    const result = await getProductAvailability('projectId', {
      ovhSubsidiary: 'subsidiary',
    });
    expect(result).toEqual(mockData);
  });

  it('throws an error when API call fails', async () => {
    const errorMessage = 'Network Error';
    vi.mocked(v6.get).mockRejectedValueOnce(new Error(errorMessage));
    await expect(
      getProductAvailability('projectId', { ovhSubsidiary: 'subsidiary' }),
    ).rejects.toThrow(errorMessage);
  });

  it('returns empty data when no plans or products are available', async () => {
    const mockData = { plans: [], products: [] };
    vi.mocked(v6.get).mockResolvedValueOnce({ data: mockData });
    const result = await getProductAvailability('projectId', {
      ovhSubsidiary: 'subsidiary',
    });
    expect(result).toEqual(mockData);
  });
});
