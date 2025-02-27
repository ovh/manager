import { apiClient } from '@ovh-ux/manager-core-api';
import { describe, expect, vi } from 'vitest';
import { getEditor } from './editor.api';

describe('notebook editor functions', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call getEditor', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getEditor({
      projectId: 'projectId',
    });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/ai/notebook/capabilities/editor',
      {
        headers: {
          'X-Pagination-Mode': 'CachedObjectList-Pages',
          'X-Pagination-Size': '50000',
        },
      },
    );
  });
});
