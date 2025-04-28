import { apiClient } from '@ovh-ux/manager-core-api';
import { describe, expect, vi } from 'vitest';
import { getGuides } from '@/data/api/ai/guides/guide.api';

describe('Guides functions', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call getGuide with no filter', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getGuides({
      projectId: 'projectId',
      lang: 'fr-FR',
    });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/ai/guides',
      {
        headers: {
          'X-Pagination-Filter': 'lang:eq=fr-FR',
          'X-Pagination-Mode': 'CachedObjectList-Pages',
          'X-Pagination-Size': '50000',
        },
      },
    );
  });

  it('should call getGuide with filter', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getGuides({
      projectId: 'projectId',
      section: ['cli'],
      lang: 'fr-FR',
    });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/ai/guides',
      {
        headers: {
          'X-Pagination-Filter': 'section:eq=cli&lang:eq=fr-FR',
          'X-Pagination-Mode': 'CachedObjectList-Pages',
          'X-Pagination-Size': '50000',
        },
      },
    );
  });
});
