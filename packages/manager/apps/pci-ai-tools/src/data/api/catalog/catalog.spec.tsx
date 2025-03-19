import { describe, expect, vi } from 'vitest';
import { apiClient } from '@ovh-ux/manager-core-api';
import { catalogApi } from '@/data/api/catalog/catalog.api';

describe('catalog api', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('should call catalog apiv6 with subsidiary and productName', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    catalogApi.getCatalog('FR', 'cloud');
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/order/catalog/public/cloud?ovhSubsidiary=FR&productName=cloud',
    );
  });
});
