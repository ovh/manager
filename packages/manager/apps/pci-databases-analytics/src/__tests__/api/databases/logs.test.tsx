import { apiClient } from '@ovh-ux/manager-core-api';
import { describe, expect, vi } from 'vitest';
import { getServiceLogs } from '../../../api/databases/logs';

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

describe('logs service function', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call getServiceLogs', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getServiceLogs({
      projectId: 'projectId',
      engine: 'engine',
      serviceId: 'serviceId',
    });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/database/engine/serviceId/logs',
    );
  });
});
