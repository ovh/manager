import { apiClient } from '@ovh-ux/manager-core-api';
import { describe, expect, vi } from 'vitest';
import {
  getNamespaces,
  addNamespace,
  editNamespace,
  deleteNamespace,
} from '@/data/api/database/namespace.api';
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

describe('namespace service functions', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call getNamespaces', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getNamespaces({
      projectId: 'projectId',
      engine: database.EngineEnum.mongodb,
      serviceId: 'serviceId',
    });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/database/mongodb/serviceId/namespace',
      {
        headers: {
          'X-Pagination-Mode': 'CachedObjectList-Pages',
          'X-Pagination-Size': '50000',
          Pragma: 'no-cache',
        },
      },
    );
  });

  it('should call addNamespace', async () => {
    expect(apiClient.v6.post).not.toHaveBeenCalled();
    await addNamespace({
      projectId: 'projectId',
      engine: database.EngineEnum.m3db,
      serviceId: 'serviceId',
      namespace: {
        name: 'myNamespace',
        resolution: '1h',
        retention: {
          periodDuration: '1D',
        },
        snapshotEnabled: false,
        type: database.m3db.namespace.TypeEnum.unaggregated,
        writesToCommitLogEnabled: false,
      },
    });
    expect(apiClient.v6.post).toHaveBeenCalledWith(
      '/cloud/project/projectId/database/m3db/serviceId/namespace',
      {
        name: 'myNamespace',
        resolution: '1h',
        retention: {
          periodDuration: '1D',
        },
        snapshotEnabled: false,
        type: database.m3db.namespace.TypeEnum.unaggregated,
        writesToCommitLogEnabled: false,
      },
    );
  });

  it('should call editNamespace', async () => {
    expect(apiClient.v6.put).not.toHaveBeenCalled();
    await editNamespace({
      projectId: 'projectId',
      engine: database.EngineEnum.mongodb,
      serviceId: 'serviceId',
      namespace: {
        id: 'namespaceId',
        resolution: '2D',
        retention: {
          periodDuration: '1D',
        },
        snapshotEnabled: false,
        writesToCommitLogEnabled: false,
      },
    });
    expect(apiClient.v6.put).toHaveBeenCalledWith(
      '/cloud/project/projectId/database/mongodb/serviceId/namespace/namespaceId',
      {
        resolution: '2D',
        retention: {
          periodDuration: '1D',
        },
        snapshotEnabled: false,
        writesToCommitLogEnabled: false,
      },
    );
  });

  it('should call deleteNamespace', async () => {
    expect(apiClient.v6.delete).not.toHaveBeenCalled();
    await deleteNamespace({
      projectId: 'projectId',
      engine: database.EngineEnum.mongodb,
      serviceId: 'serviceId',
      namespaceId: 'namespaceId',
    });
    expect(apiClient.v6.delete).toHaveBeenCalledWith(
      '/cloud/project/projectId/database/mongodb/serviceId/namespace/namespaceId',
    );
  });
});
