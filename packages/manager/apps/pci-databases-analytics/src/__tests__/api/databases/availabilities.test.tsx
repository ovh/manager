import { apiClient } from '@ovh-ux/manager-core-api';
import { describe, expect, vi } from 'vitest';
import {
  getAvailabilities,
  getSuggestions,
  getCapabilities,
  getEnginesCapabilities,
  getRegionsCapabilities,
} from '@/api/databases/availabilities';
import { database } from '@/models/database';

vi.mock('@ovh-ux/manager-core-api', () => {
  const get = vi.fn(() => {
    return Promise.resolve({ data: null });
  });
  return {
    apiClient: {
      v6: {
        get,
      },
    },
  };
});

describe('database api functions', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call getAvailabilities with no status filter', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getAvailabilities({ projectId: 'projectId', status: [] });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/database/availability',
      {
        headers: {
          'X-Pagination-Mode': 'CachedObjectList-Pages',
          'X-Pagination-Size': '50000',
        },
      },
    );
  });
  it('should call getAvailabilities with multiple statuses', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getAvailabilities({ projectId: 'projectId' });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/database/availability',
      {
        headers: {
          'X-Pagination-Filter': 'lifecycle.status:in=STABLE,BETA',
          'X-Pagination-Mode': 'CachedObjectList-Pages',
          'X-Pagination-Size': '50000',
        },
      },
    );
  });
  it('should call getAvailabilities with one status', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getAvailabilities({
      projectId: 'projectId',
      status: [database.availability.StatusEnum.STABLE],
    });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/database/availability',
      {
        headers: {
          'X-Pagination-Filter': 'lifecycle.status:eq=STABLE',
          'X-Pagination-Mode': 'CachedObjectList-Pages',
          'X-Pagination-Size': '50000',
        },
      },
    );
  });
  it('should call getAvailabilities with target, action and service', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getAvailabilities({
      projectId: 'projectId',
      serviceId: '1234',
      action: database.availability.ActionEnum.update,
      target: database.availability.TargetEnum.plan,
    });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/database/availability?clusterId=1234&action=update&target=plan',
      {
        headers: {
          Pragma: 'no-cache',
          'X-Pagination-Filter': 'lifecycle.status:in=STABLE,BETA',
          'X-Pagination-Mode': 'CachedObjectList-Pages',
          'X-Pagination-Size': '50000',
        },
      },
    );
  });

  it('should call getSuggestions', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getSuggestions('projectId');
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/database/availability/suggestion',
    );
  });

  it('should call getCapabilities', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getCapabilities('projectId');
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/database/capabilities',
    );
  });

  it('should call getEnginesCapabilities', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getEnginesCapabilities('projectId');
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/database/capabilities/engines',
    );
  });

  it('should call getRegionsCapabilities', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getRegionsCapabilities('projectId');
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/database/capabilities/regions',
    );
  });
});
