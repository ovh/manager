import { describe, expect, vi } from 'vitest';
import { apiClient } from '@/data/api/api.client';
import { getIndexes, deleteIndex } from '@/data/api/database/indexes.api';
import * as database from '@/types/cloud/project/database';

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
