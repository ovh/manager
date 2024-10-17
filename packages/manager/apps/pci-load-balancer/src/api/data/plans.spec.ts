import { describe, it, expect, vi } from 'vitest';
import { v6 } from '@ovh-ux/manager-core-api';
import { getPlans, TPlanResponse } from './plans';

describe('getPlans', () => {
  it('should fetch plans successfully', async () => {
    const mockResponse: TPlanResponse = {
      plans: [
        {
          code: 'plan1',
          regions: [
            {
              continentCode: 'EU',
              datacenter: 'dc1',
              enabled: true,
              name: 'region1',
              type: 'public',
            },
          ],
        },
      ],
    };

    vi.mocked(v6.get).mockResolvedValueOnce({ data: mockResponse });

    const projectId = 'test-project';
    const ovhSubsidiary = 'FR';
    const result = await getPlans(projectId, ovhSubsidiary);

    expect(v6.get).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/capabilities/productAvailability?addonFamily=octavia-loadbalancer&ovhSubsidiary=${ovhSubsidiary}`,
    );
    expect(result).toEqual(mockResponse);
  });

  it('should handle errors', async () => {
    vi.mocked(v6.get).mockRejectedValueOnce(new Error('API Error'));

    const projectId = 'test-project';
    const ovhSubsidiary = 'FR';

    await expect(getPlans(projectId, ovhSubsidiary)).rejects.toThrow(
      'API Error',
    );
  });
});
