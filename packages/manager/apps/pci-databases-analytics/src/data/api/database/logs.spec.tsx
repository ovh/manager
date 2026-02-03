import { describe, expect, vi } from 'vitest';
import { apiClient } from '@/data/api/api.client';
import { getServiceLogs } from '@/data/api/database/logs.api';
import * as database from '@/types/cloud/project/database';

describe('logs service function', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call getServiceLogs', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getServiceLogs({
      projectId: 'projectId',
      engine: database.EngineEnum.mongodb,
      serviceId: 'serviceId',
    });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/database/mongodb/serviceId/logs',
    );
  });
});
