import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as jobApi from '@/data/api/ai/job/job.api';
import { mockedJob } from '@/__tests__/helpers/mocks/job/job';
import { useGetJob } from './useGetJob.hook';

vi.mock('@/data/api/ai/job/job.api', () => ({
  getJob: vi.fn(),
}));

describe('useGetJob', () => {
  it('should return Job', async () => {
    const projectId = 'projectId';
    const jobId = 'jobId';

    vi.mocked(jobApi.getJob).mockResolvedValue(mockedJob);

    const { result } = renderHook(() => useGetJob(projectId, jobId), {
      wrapper: QueryClientWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(mockedJob);
      expect(jobApi.getJob).toHaveBeenCalledWith({
        projectId,
        jobId,
      });
    });
  });
});
