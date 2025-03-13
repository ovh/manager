import { apiClient } from '@ovh-ux/manager-core-api';
import { describe, expect, vi } from 'vitest';
import { getIndexes, deleteIndex } from '@/data/api/database/indexes.api';
import * as database from '@/types/cloud/project/database';

vi.mock('@ovh-ux/manager-core-api', () => {
  const get = vi.fn(() => {
    return Promise.resolve({ data: null });
  });
  const post = vi.fn(() => {
    return Promise.resolve({ data: null });
  });
  const put = vi.fn(() => {
    return Promise.resolve({ data: null });
  });
  const del = vi.fn(() => {
    return Promise.resolve({ data: null });
  });
  return {
    apiClient: {
      v6: {
        get,
        post,
        put,
        delete: del,
      },
    },
  };
});

describe('indexes service functions', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call getIndexes', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getIndexes({
      projectId: 'projectId',
      engine: database.EngineEnum.opensearch,
      serviceId: 'serviceId',
    });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/database/opensearch/serviceId/index',
      {
        headers: {
          'X-Pagination-Mode': 'CachedObjectList-Pages',
          'X-Pagination-Size': '50000',
          Pragma: 'no-cache',
        },
      },
    );
  });

  it('should call deleteIndex', async () => {
    expect(apiClient.v6.delete).not.toHaveBeenCalled();
    await deleteIndex({
      projectId: 'projectId',
      engine: database.EngineEnum.opensearch,
      serviceId: 'serviceId',
      indexId: 'indexId',
    });
    expect(apiClient.v6.delete).toHaveBeenCalledWith(
      '/cloud/project/projectId/database/opensearch/serviceId/index/indexId',
    );
  });
});
