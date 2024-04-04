import { apiClient } from '@ovh-ux/manager-core-api';
import { describe, expect, vi } from 'vitest';
import {
  getNamespaces,
  addNamespace,
  editNamespace,
  deleteNamespace,
} from '../../../api/databases/namespaces';

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
      engine: 'engine',
      serviceId: 'serviceId',
    });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/database/engine/serviceId/namespace',
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
      engine: 'engine',
      serviceId: 'serviceId',
      namespace: {
        name: 'myNamespace',
      },
    });
    expect(
      apiClient.v6.post,
    ).toHaveBeenCalledWith(
      '/cloud/project/projectId/database/engine/serviceId/namespace',
      { name: 'myNamespace' },
    );
  });

  it('should call editNamespace', async () => {
    expect(apiClient.v6.put).not.toHaveBeenCalled();
    await editNamespace({
      projectId: 'projectId',
      engine: 'engine',
      serviceId: 'serviceId',
      namespace: {
        id: 'namespaceId',
        name: 'myNewNamespace',
      },
    });
    expect(
      apiClient.v6.put,
    ).toHaveBeenCalledWith(
      '/cloud/project/projectId/database/engine/serviceId/namespace/namespaceId',
      { name: 'myNewNamespace' },
    );
  });

  it('should call deleteNamespace', async () => {
    expect(apiClient.v6.delete).not.toHaveBeenCalled();
    await deleteNamespace({
      projectId: 'projectId',
      engine: 'engine',
      serviceId: 'serviceId',
      namespaceId: 'namespaceId',
    });
    expect(apiClient.v6.delete).toHaveBeenCalledWith(
      '/cloud/project/projectId/database/engine/serviceId/namespace/namespaceId',
    );
  });
});
