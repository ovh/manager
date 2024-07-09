import { apiClient } from '@ovh-ux/manager-core-api';
import { describe, expect, vi } from 'vitest';
import {
  addRegistry,
  deleteRegistry,
  editRegistry,
  getRegistries,
} from '@/data/api/apiRegistry';
import {
  mockedRegistryEdit,
  mockedRegistryInput,
} from '../../__tests__/helpers/mocks/registry';

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

describe('Registry functions', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call getRegistries', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getRegistries({
      projectId: 'projectId',
    });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/ai/registry',
      {
        headers: {
          'X-Pagination-Mode': 'CachedObjectList-Pages',
          'X-Pagination-Size': '50000',
          Pragma: 'no-cache',
        },
      },
    );
  });

  it('should call addRegistry with mockedRegistryInput', async () => {
    expect(apiClient.v6.post).not.toHaveBeenCalled();
    await addRegistry({
      projectId: 'projectId',
      registry: mockedRegistryInput,
    });
    expect(apiClient.v6.post).toHaveBeenCalledWith(
      '/cloud/project/projectId/ai/registry',
      mockedRegistryInput,
    );
  });

  it('should call editRegistry with mockedRegistryEdit', async () => {
    expect(apiClient.v6.put).not.toHaveBeenCalled();
    await editRegistry({
      projectId: 'projectId',
      registry: mockedRegistryEdit,
      registryId: 'registryId',
    });
    expect(apiClient.v6.put).toHaveBeenCalledWith(
      '/cloud/project/projectId/ai/registry/registryId',
      mockedRegistryEdit,
    );
  });

  it('should call deleteDatasore with registryID', async () => {
    expect(apiClient.v6.delete).not.toHaveBeenCalled();
    await deleteRegistry({
      projectId: 'projectId',
      registryId: 'registryId',
    });
    expect(apiClient.v6.delete).toHaveBeenCalledWith(
      '/cloud/project/projectId/ai/registry/registryId',
    );
  });
});
