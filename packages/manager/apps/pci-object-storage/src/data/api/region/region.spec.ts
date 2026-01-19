import { apiClient } from '@ovh-ux/manager-core-api';
import { describe, expect, vi } from 'vitest';
import { getRegions } from './region.api';

describe('Region functions', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call getRegions', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getRegions({ projectId: 'projectId' });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/region',
      {
        headers: {
          'X-Pagination-Mode': 'CachedObjectList-Pages',
          'X-Pagination-Size': '50000',
          Pragma: 'no-cache',
        },
      },
    );
  });
});
