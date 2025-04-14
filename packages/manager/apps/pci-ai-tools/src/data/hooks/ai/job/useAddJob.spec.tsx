import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as jobApi from '@/data/api/ai/job/job.api';
import { mockedJob, mockedJobSpec } from '@/__tests__/helpers/mocks/job/job';
import { useAddJob } from './useAddJob.hook';

vi.mock('@/data/api/ai/job/job.api', () => ({
  addJob: vi.fn(),
}));

describe('useAddJob', () => {
  it('should create a job', async () => {
    const onSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(jobApi.addJob).mockResolvedValue(mockedJob);

    const { result } = renderHook(() => useAddJob({ onError, onSuccess }), {
      wrapper: QueryClientWrapper,
    });

    result.current.addJob(mockedJobSpec);

    await waitFor(() => {
      expect(jobApi.addJob).toHaveBeenCalledWith({
        projectId: undefined,
        jobInfo: mockedJobSpec,
      });
      expect(onSuccess).toHaveBeenCalledWith(mockedJob);
    });
  });
});
