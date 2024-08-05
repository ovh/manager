import { apiClient } from '@ovh-ux/manager-core-api';
import { describe, expect, vi } from 'vitest';
import { getAuthorization, postAuthorization } from './authorization.api';

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

  it('should call postAuthorization', async () => {
    expect(apiClient.v6.post).not.toHaveBeenCalled();
    await postAuthorization({
      projectId: 'projectId',
    });
    expect(apiClient.v6.post).toHaveBeenCalledWith(
      '/cloud/project/projectId/ai/authorization',
    );
  });
});
