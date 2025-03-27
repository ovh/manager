import { apiClient } from '@ovh-ux/manager-core-api';
import { describe, expect, vi } from 'vitest';
import { getCurrentUsage } from './usage.api';

describe('current usage functions', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call getCurrentUsage', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getCurrentUsage({
      projectId: 'projectId',
    });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/usage/current',
    );
  });
});
