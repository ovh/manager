import { apiClient } from '@ovh-ux/manager-core-api';
import { OvhSubsidiaryEnum } from '@datatr-ux/ovhcloud-types/nichandle';
import { describe, expect, vi } from 'vitest';
import { getProductAvailability } from './availability.api';

describe('Availability functions', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call getProductAvailability', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getProductAvailability({
      projectId: 'projectId',
      ovhSubsidiary: OvhSubsidiaryEnum.FR,
    });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/capabilities/productAvailability',
      {
        params: {
          ovhSubsidiary: 'FR',
        },
      },
    );
  });
});
