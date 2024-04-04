import { apiClient } from '@ovh-ux/manager-core-api';
import { describe, expect, vi } from 'vitest';
import {
  getServices,
  getService,
  addService,
  updateService,
  deleteService,
} from '../../../api/databases/service';

vi.mock('@ovh-ux/manager-core-api', () => {
  const get = vi.fn(() => {
    return Promise.resolve({ data: [] });
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

describe('database service functions', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call getServices', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getServices({ projectId: 'projectId' });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/database/service',
      {
        headers: {
          'X-Pagination-Mode': 'CachedObjectList-Pages',
          'X-Pagination-Size': '50000',
          Pragma: 'no-cache',
        },
      },
    );
  });

  it('should call getService', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getService({
      projectId: 'projectId',
      serviceId: 'serviceId',
    });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/database/service/serviceId',
    );
  });

  it('should call addService', async () => {
    expect(apiClient.v6.post).not.toHaveBeenCalled();
    await addService({
      projectId: 'projectId',
      engine: 'engine',
      serviceInfo: {
        description: 'newService',
      },
    });
    expect(apiClient.v6.post).toHaveBeenCalledWith(
      '/cloud/project/projectId/database/engine',
      {
        description: 'newService',
      },
    );
  });

  it('should call updateService', async () => {
    expect(apiClient.v6.put).not.toHaveBeenCalled();
    await updateService({
      projectId: 'projectId',
      engine: 'engine',
      serviceId: 'serviceId',
      data: {
        description: 'newServiceName',
      },
    });
    expect(apiClient.v6.put).toHaveBeenCalledWith(
      '/cloud/project/projectId/database/engine/serviceId',
      {
        description: 'newServiceName',
      },
    );
  });

  it('should call deleteService', async () => {
    expect(apiClient.v6.delete).not.toHaveBeenCalled();
    await deleteService({
      projectId: 'projectId',
      engine: 'engine',
      serviceId: 'serviceId',
    });
    expect(apiClient.v6.delete).toHaveBeenCalledWith(
      '/cloud/project/projectId/database/engine/serviceId',
    );
  });
});
