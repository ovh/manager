import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as jobApi from '@/data/api/ai/job/job.api';
import { useKillJob } from './useKillJob.hook';
import { JobData } from '@/data/api';

vi.mock('@/data/api/ai/job/job.api', () => ({
  killJob: vi.fn(),
}));

describe('useKillJob', () => {
  it('should stop the job', async () => {
    const projectId = 'projectId';
    const jobId = 'jobId';
    const onStopSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(jobApi.killJob).mockResolvedValue(undefined);

    const { result } = renderHook(
      () => useKillJob({ onError, onStopSuccess }),
      {
        wrapper: QueryClientWrapper,
      },
    );

    const stopJobProps: JobData = {
      projectId,
      jobId,
    };

    result.current.killJob(stopJobProps);

    await waitFor(() => {
      expect(jobApi.killJob).toHaveBeenCalledWith(stopJobProps);
      expect(onStopSuccess).toHaveBeenCalledWith();
    });
  });
});
