import { v6 } from '@ovh-ux/manager-core-api';
import { TRegion } from '@ovh-ux/manager-react-components';
import { describe, expect, it, vi } from 'vitest';
import {
  getProductRegionsAvailability,
  getProjectRegionDetails,
} from './region';

vi.mock('@ovh-ux/manager-core-api', () => ({
  v6: {
    get: vi.fn(),
  },
}));

describe('Regions API ', () => {
  const projectId = 'project123';
  const region = 'regionA';
  const ovhSubsidiary = 'FR';
  const planCode = 'code';

  it('should fetch project region details', async () => {
    const mockData = {
      name: 'regionA',
    } as TRegion;
    vi.mocked(v6.get).mockResolvedValue({ data: mockData });

    const data = await getProjectRegionDetails(projectId, region);

    expect(data).toEqual(mockData);
    expect(v6.get).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/region/${region}`,
    );
  });

  it('should fetch product regions availability', async () => {
    const mockData = {
      plans: [{ code: 'code1', regions: ['BHS', 'CA'] }],
      products: [
        {
          name: 'product1',
          regions: ['BHS'],
        },
      ],
    };
    vi.mocked(v6.get).mockResolvedValue({ data: mockData });

    const data = await getProductRegionsAvailability(ovhSubsidiary, planCode);

    expect(data).toEqual(mockData.plans[0].regions);
    expect(v6.get).toHaveBeenCalledWith(
      `/cloud/order/rule/availability?ovhSubsidiary=${ovhSubsidiary}&planCode=${planCode}`,
    );
  });
});
