import { apiClient } from '@ovh-ux/manager-core-api';
import { describe, expect, vi } from 'vitest';
import { getCurrentUsage } from './usage.api';

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
