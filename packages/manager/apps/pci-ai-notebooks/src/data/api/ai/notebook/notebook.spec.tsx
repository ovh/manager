import { apiClient } from '@ovh-ux/manager-core-api';
import { describe, expect, vi } from 'vitest';
import { getNotebooks } from '@/data/api/ai/notebook/notebook.api';

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

describe('notebook functions', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call getNotebooks', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getNotebooks({
      projectId: 'projectId',
    });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/ai/notebook',
      {
        headers: {
          'X-Pagination-Mode': 'CachedObjectList-Pages',
          'X-Pagination-Size': '50000',
          Pragma: 'no-cache',
        },
      },
    );
  });
});
