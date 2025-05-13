import { describe, expect, vi } from 'vitest';
import { apiClient } from '@ovh-ux/manager-core-api';
import { getProject } from '@/data/api/project/project.api';

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
