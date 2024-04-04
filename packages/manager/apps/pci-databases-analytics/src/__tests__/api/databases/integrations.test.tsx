import { apiClient } from '@ovh-ux/manager-core-api';
import { describe, expect, vi } from 'vitest';
import {
  getServiceIntegrations,
  getServiceCapabilitiesIntegrations,
  addIntegration,
  deleteIntegration,
} from '../../../api/databases/integrations';

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

describe('integration service functions', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call getServiceIntegrations', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getServiceIntegrations({
      projectId: 'projectId',
      engine: 'engine',
      serviceId: 'serviceId',
    });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/database/engine/serviceId/integration',
      {
        headers: {
          'X-Pagination-Mode': 'CachedObjectList-Pages',
          'X-Pagination-Size': '50000',
          Pragma: 'no-cache',
        },
      },
    );
  });

  it('should call getServiceCapabilitiesIntegrations', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getServiceCapabilitiesIntegrations({
      projectId: 'projectId',
      engine: 'engine',
      serviceId: 'serviceId',
    });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/database/engine/serviceId/capabilities/integration',
      {
        headers: {
          'X-Pagination-Mode': 'CachedObjectList-Pages',
          'X-Pagination-Size': '50000',
          Pragma: 'no-cache',
        },
      },
    );
  });

  it('should call addIntegration', async () => {
    expect(apiClient.v6.post).not.toHaveBeenCalled();
    await addIntegration({
      projectId: 'projectId',
      engine: 'engine',
      serviceId: 'serviceId',
      integration: {
        type: 'mockIntegration',
      },
    });
    expect(
      apiClient.v6.post,
    ).toHaveBeenCalledWith(
      '/cloud/project/projectId/database/engine/serviceId/integration',
      { type: 'mockIntegration' },
    );
  });

  it('should call deleteIntegration', async () => {
    expect(apiClient.v6.delete).not.toHaveBeenCalled();
    await deleteIntegration({
      projectId: 'projectId',
      engine: 'engine',
      serviceId: 'serviceId',
      integrationId: 'integrationId',
    });
    expect(apiClient.v6.delete).toHaveBeenCalledWith(
      '/cloud/project/projectId/database/engine/serviceId/integration/integrationId',
    );
  });
});
