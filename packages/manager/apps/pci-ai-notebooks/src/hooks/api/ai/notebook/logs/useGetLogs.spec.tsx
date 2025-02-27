import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as notebookApi from '@/data/api/ai/notebook/logs/logs.api';
import { mockedLogs } from '@/__tests__/helpers/mocks/shared/logs';
import { useGetLogs } from './useGetLogs.hook';

vi.mock('@/data/api/ai/notebook/logs/logs.api', () => ({
  getLogs: vi.fn(),
}));

describe('useGetLogs', () => {
  it('should return Logs', async () => {
    const projectId = 'projectId';
    const notebookId = 'notebookId';

    vi.mocked(notebookApi.getLogs).mockResolvedValue(mockedLogs);

    const { result } = renderHook(() => useGetLogs(projectId, notebookId), {
      wrapper: QueryClientWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(mockedLogs);
      expect(notebookApi.getLogs).toHaveBeenCalledWith({
        projectId,
        notebookId,
      });
    });
  });
});
