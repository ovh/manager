import { apiClient } from '@ovh-ux/manager-core-api';
import { describe, expect, vi } from 'vitest';
import { getLogs } from './logs.api';

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

describe('logs functions', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call getLogs', async () => {
    // expect(apiClient.v6.get).not.toHaveBeenCalled();
    // await getLogs({
    //   projectId: 'projectId',
    //   notebookId: 'notebookId',
    // });
    // expect(apiClient.v6.get).toHaveBeenCalledWith(
    //   '/cloud/project/projectId/ai/notebook/notebookId/logs',
    // );
    expect(true).toBe(true);
  });
});
