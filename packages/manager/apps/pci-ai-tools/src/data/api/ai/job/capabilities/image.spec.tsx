import { apiClient } from '@ovh-ux/manager-core-api';
import { describe, expect, vi } from 'vitest';
import { getPresetImage } from './image.api';

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

describe('preset image functions', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call getPresetImage', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getPresetImage({
      projectId: 'projectId',
    });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/ai/job/capabilities/presetImage',
      {
        headers: {
          'X-Pagination-Mode': 'CachedObjectList-Pages',
          'X-Pagination-Size': '50000',
        },
      },
    );
  });
});
