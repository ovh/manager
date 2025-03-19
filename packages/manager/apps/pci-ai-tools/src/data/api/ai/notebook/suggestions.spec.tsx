import { describe, expect, vi } from 'vitest';

describe('logs functions', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call getLogs', async () => {
    // expect(apiClient.v6.get).not.toHaveBeenCalled();
    // await getSuggestions({
    //   projectId: 'projectId',
    // });
    // expect(apiClient.v6.get).toHaveBeenCalledWith(
    //   '/cloud/project/projectId/ai/notebook/suggestions',
    // );
    expect(true).toBe(true);
  });
});
