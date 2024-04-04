import { apiClient } from '@ovh-ux/manager-core-api';
import { describe, expect, vi } from 'vitest';
import {
  getServiceDatabases,
  addDatabase,
  deleteDatabase,
} from '../../../api/databases/databases';

vi.mock('@ovh-ux/manager-core-api', () => {
  const get = vi.fn(() => {
    return Promise.resolve({ data: null });
  });
  const post = vi.fn(() => {
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
        delete: del,
      },
    },
  };
});

describe('database service functions', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call getServiceDatabases', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getServiceDatabases({
      projectId: 'projectId',
      engine: 'engine',
      serviceId: 'serviceId',
    });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/database/engine/serviceId/database',
      {
        headers: {
          'X-Pagination-Mode': 'CachedObjectList-Pages',
          'X-Pagination-Size': '50000',
          Pragma: 'no-cache',
        },
      },
    );
  });

  it('should call addDatabase', async () => {
    expect(apiClient.v6.post).not.toHaveBeenCalled();
    await addDatabase({
      projectId: 'projectId',
      engine: 'engine',
      serviceId: 'serviceId',
      name: 'newDatabaseName',
    });
    expect(apiClient.v6.post).toHaveBeenCalledWith(
      '/cloud/project/projectId/database/engine/serviceId/database',
      {
        name: 'newDatabaseName',
      },
    );
  });

  it('should call deleteDatabase', async () => {
    expect(apiClient.v6.delete).not.toHaveBeenCalled();
    await deleteDatabase({
      projectId: 'projectId',
      engine: 'engine',
      serviceId: 'serviceId',
      databaseId: 'databaseId',
    });
    expect(apiClient.v6.delete).toHaveBeenCalledWith(
      '/cloud/project/projectId/database/engine/serviceId/database/databaseId',
    );
  });
});
