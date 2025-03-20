import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as jobApi from '@/data/api/ai/job/logs/logs.api';
import { mockedLogs } from '@/__tests__/helpers/mocks/shared/logs';
import { useGetLogs } from './useGetLogs.hook';

vi.mock('@/data/api/ai/job/logs/logs.api', () => ({
  getLogs: vi.fn(),
}));

describe('useGetLogs', () => {
  it('should return Logs', async () => {
    const projectId = 'projectId';
    const jobId = 'jobId';

    vi.mocked(jobApi.getLogs).mockResolvedValue(mockedLogs);

    const { result } = renderHook(() => useGetLogs(projectId, jobId), {
      wrapper: QueryClientWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(mockedLogs);
      expect(jobApi.getLogs).toHaveBeenCalledWith({
        projectId,
        jobId,
      });
    });
  });
});
