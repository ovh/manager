import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as jobApi from '@/data/api/apiJob';
import { mockedJob } from '@/__tests__/helpers/mocks/job';
import { useGetJobs } from './useGetJobs';

vi.mock('@/data/api/apiJob', () => ({
  getJobs: vi.fn(),
}));

describe('useGetJobs', () => {
  it('should return Jobs', async () => {
    const projectId = 'projectId';

    vi.mocked(jobApi.getJobs).mockResolvedValue([mockedJob]);

    const { result } = renderHook(() => useGetJobs(projectId), {
      wrapper: QueryClientWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual([mockedJob]);
      expect(jobApi.getJobs).toHaveBeenCalledWith({
        projectId,
      });
    });
  });
});
