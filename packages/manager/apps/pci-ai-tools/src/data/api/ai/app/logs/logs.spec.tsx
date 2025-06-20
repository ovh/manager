import { apiClient } from '@ovh-ux/manager-core-api';
import { describe, expect, vi } from 'vitest';
import { getLogs } from './logs.api';

describe('logs functions', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call getLogs', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getLogs({
      projectId: 'projectId',
      appId: 'appId',
    });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/ai/app/appId/log',
    );
    expect(true).toBe(true);
  });
});
