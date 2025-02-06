import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as jobApi from '@/data/api/ai/job/job.api';
import { useDeleteJob } from './useDeleteJob.hook';

vi.mock('@/data/api/ai/job/job.api', () => ({
  deleteJob: vi.fn(),
}));

describe('useDeleteJob', () => {
  it('should delete a Job', async () => {
    const projectId = 'projectId';
    const jobId = 'jobId';
    const onDeleteSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(jobApi.deleteJob).mockResolvedValue(undefined);

    const { result } = renderHook(
      () => useDeleteJob({ onError, onDeleteSuccess }),
      {
        wrapper: QueryClientWrapper,
      },
    );

    const deleteJobProps = {
      projectId,
      jobId,
    };
    result.current.deleteJob(deleteJobProps);

    await waitFor(() => {
      expect(jobApi.deleteJob).toHaveBeenCalledWith(deleteJobProps);
    });
  });
});
