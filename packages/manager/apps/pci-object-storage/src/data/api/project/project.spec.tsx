import { describe, expect, vi } from 'vitest';
import { apiClient } from '@/data/api/api.client';
import { getProject } from '@/data/api/project/project.api';

vi.mock('@/data/api/api.client', () => {
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

describe('project api', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('should call cloud project apiv6 with project id', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    getProject('foo');
    expect(apiClient.v6.get).toHaveBeenCalledWith('/cloud/project/foo');
  });
});
