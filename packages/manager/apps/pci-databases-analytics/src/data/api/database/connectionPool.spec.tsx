import { apiClient } from '@ovh-ux/manager-core-api';
import { describe, expect, vi } from 'vitest';
import {
  getConnectionPools,
  addConnectionPool,
  editConnectionPool,
  deleteConnectionPool,
} from '@/data/api/database/connectionPool.api';
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

describe('connection pool service functions', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call getConnectionPools', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getConnectionPools({
      projectId: 'projectId',
      engine: database.EngineEnum.mongodb,
      serviceId: 'serviceId',
    });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/database/mongodb/serviceId/connectionPool',
      {
        headers: {
          'X-Pagination-Mode': 'CachedObjectList-Pages',
          'X-Pagination-Size': '50000',
          Pragma: 'no-cache',
        },
      },
    );
  });

  it('should call addConnectionPool', async () => {
    expect(apiClient.v6.post).not.toHaveBeenCalled();
    await addConnectionPool({
      projectId: 'projectId',
      engine: database.EngineEnum.mongodb,
      serviceId: 'serviceId',
      connectionPool: {
        name: 'newPool',
        databaseId: '123',
        mode: database.postgresql.connectionpool.ModeEnum.session,
        size: 0,
      },
    });
    expect(apiClient.v6.post).toHaveBeenCalledWith(
      '/cloud/project/projectId/database/mongodb/serviceId/connectionPool',
      {
        name: 'newPool',
        databaseId: '123',
        mode: database.postgresql.connectionpool.ModeEnum.session,
        size: 0,
      },
    );
  });

  it('should call editConnectionPool', async () => {
    expect(apiClient.v6.put).not.toHaveBeenCalled();
    await editConnectionPool({
      projectId: 'projectId',
      engine: database.EngineEnum.mongodb,
      serviceId: 'serviceId',
      connectionPool: {
        id: 'connectionPoolId',
        databaseId: '123',
        mode: database.postgresql.connectionpool.ModeEnum.session,
        size: 0,
      },
    });
    expect(apiClient.v6.put).toHaveBeenCalledWith(
      '/cloud/project/projectId/database/mongodb/serviceId/connectionPool/connectionPoolId',
      {
        databaseId: '123',
        mode: database.postgresql.connectionpool.ModeEnum.session,
        size: 0,
      },
    );
  });

  it('should call deleteConnectionPool', async () => {
    expect(apiClient.v6.delete).not.toHaveBeenCalled();
    await deleteConnectionPool({
      projectId: 'projectId',
      engine: database.EngineEnum.mongodb,
      serviceId: 'serviceId',
      connectionPoolId: 'connectionPoolId',
    });
    expect(apiClient.v6.delete).toHaveBeenCalledWith(
      '/cloud/project/projectId/database/mongodb/serviceId/connectionPool/connectionPoolId',
    );
  });
});
