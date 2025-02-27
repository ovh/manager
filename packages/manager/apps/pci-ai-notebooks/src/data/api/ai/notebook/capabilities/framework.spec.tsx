import { apiClient } from '@ovh-ux/manager-core-api';
import { describe, expect, vi } from 'vitest';
import { getFramework } from './framework.api';

describe('notebook framework functions', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call getFramework', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getFramework({
      projectId: 'projectId',
    });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/ai/notebook/capabilities/framework',
      {
        headers: {
          'X-Pagination-Mode': 'CachedObjectList-Pages',
          'X-Pagination-Size': '50000',
        },
      },
    );
  });
});
