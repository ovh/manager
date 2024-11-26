import { apiClient } from '@ovh-ux/manager-core-api';
import { describe, expect, vi } from 'vitest';
import { getRegions, getFlavor } from './capabilities.api';

vi.mock('@ovh-ux/manager-core-api', () => {
  const get = vi.fn(() => {
    return Promise.resolve({ data: null });
  });
  return {
    apiClient: {
      v6: {
        get,
      },
    },
  };
});

describe('Capabilities functions', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call getRegions', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getRegions({
      projectId: 'projectId',
    });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/ai/capabilities/region',
      {
        headers: {
          'X-Pagination-Mode': 'CachedObjectList-Pages',
          'X-Pagination-Size': '50000',
        },
      },
    );
  });
});

describe('Capabilities Flavor functions', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call getFlavor', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getFlavor({
      projectId: 'projectId',
      region: 'regionId',
    });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/ai/capabilities/region/regionId/flavor',
    );
  });
});
