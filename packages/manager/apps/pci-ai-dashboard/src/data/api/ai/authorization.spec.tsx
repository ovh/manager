import { apiClient } from '@ovh-ux/manager-core-api';
import { describe, expect, vi } from 'vitest';
import { getAuthorization } from './authorization.api';

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

describe('Authorization functions', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call getAuthorization', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getAuthorization({
      projectId: 'projectId',
    });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/ai/authorization',
    );
  });
});
