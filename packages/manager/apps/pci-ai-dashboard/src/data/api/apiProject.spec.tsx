import { apiClient } from '@ovh-ux/manager-core-api';
import { describe, expect, vi } from 'vitest';
import { getProject } from '@/data/api/apiProjects';

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

describe('project functions', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call getNotebooks', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getProject('projectId');
    expect(apiClient.v6.get).toHaveBeenCalledWith('/cloud/project/projectId');
  });
});
