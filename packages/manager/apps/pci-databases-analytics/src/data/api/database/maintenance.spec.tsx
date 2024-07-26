import { apiClient } from '@ovh-ux/manager-core-api';
import { describe, expect, vi } from 'vitest';
import {
  getMaintenances,
  applyMaintenance,
} from '@/data/api/database/maintenance.api';
import * as database from '@/types/cloud/project/database';

vi.mock('@ovh-ux/manager-core-api', () => {
  const get = vi.fn(() => {
    return Promise.resolve({ data: null });
  });
  const post = vi.fn(() => {
    return Promise.resolve({ data: null });
  });
  return {
    apiClient: {
      v6: {
        get,
        post,
      },
    },
  };
});

describe('maintenance service functions', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call getMaintenances', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getMaintenances({
      projectId: 'projectId',
      engine: database.EngineEnum.mongodb,
      serviceId: 'serviceId',
    });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/database/mongodb/serviceId/maintenance',
      {
        headers: {
          'X-Pagination-Mode': 'CachedObjectList-Pages',
          'X-Pagination-Size': '50000',
          Pragma: 'no-cache',
        },
      },
    );
  });

  it('should call applyMaintenance', async () => {
    expect(apiClient.v6.post).not.toHaveBeenCalled();
    await applyMaintenance({
      projectId: 'projectId',
      engine: database.EngineEnum.mongodb,
      serviceId: 'serviceId',
      maintenanceId: 'maintenanceId',
    });
    expect(apiClient.v6.post).toHaveBeenCalledWith(
      '/cloud/project/projectId/database/mongodb/serviceId/maintenance/maintenanceId/apply',
    );
  });
});
