import { apiClient } from '@ovh-ux/manager-core-api';
import { describe, expect, vi } from 'vitest';
import { getPartner, signPartnerContract } from './partner.api';

describe('partner functions', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call getApps', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getPartner({
      projectId: 'projectId',
      region: 'region',
    });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/ai/partners/region/region/partner',
    );
  });

  it('should call signPartnerContract', async () => {
    expect(apiClient.v6.post).not.toHaveBeenCalled();
    await signPartnerContract({
      projectId: 'projectId',
      region: 'region',
      partnerId: 'partnerId',
    });
    expect(apiClient.v6.post).toHaveBeenCalledWith(
      '/cloud/project/projectId/ai/partners/region/region/partner/partnerId/contract/signature',
    );
  });
});
