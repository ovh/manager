import { apiClient } from '@ovh-ux/manager-core-api';
import { describe, expect, vi } from 'vitest';
import {
  getPatterns,
  addPattern,
  deletePattern,
} from '@/data/api/database/pattern.api';
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

describe('pattern service functions', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call getPatterns', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getPatterns({
      projectId: 'projectId',
      engine: database.EngineEnum.opensearch,
      serviceId: 'serviceId',
    });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/database/opensearch/serviceId/pattern',
      {
        headers: {
          'X-Pagination-Mode': 'CachedObjectList-Pages',
          'X-Pagination-Size': '50000',
          Pragma: 'no-cache',
        },
      },
    );
  });

  it('should call addPattern', async () => {
    expect(apiClient.v6.post).not.toHaveBeenCalled();
    await addPattern({
      projectId: 'projectId',
      engine: database.EngineEnum.opensearch,
      serviceId: 'serviceId',
      pattern: {
        pattern: 'myPattern',
        maxIndexCount: 256,
      },
    });
    expect(apiClient.v6.post).toHaveBeenCalledWith(
      '/cloud/project/projectId/database/opensearch/serviceId/pattern',
      {
        pattern: 'myPattern',
        maxIndexCount: 256,
      },
    );
  });

  it('should call deletePattern', async () => {
    expect(apiClient.v6.delete).not.toHaveBeenCalled();
    await deletePattern({
      projectId: 'projectId',
      engine: database.EngineEnum.opensearch,
      serviceId: 'serviceId',
      patternId: 'patternId',
    });
    expect(apiClient.v6.delete).toHaveBeenCalledWith(
      '/cloud/project/projectId/database/opensearch/serviceId/pattern/patternId',
    );
  });
});
