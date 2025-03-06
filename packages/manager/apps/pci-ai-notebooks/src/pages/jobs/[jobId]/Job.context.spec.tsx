import { vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedJob } from '@/__tests__/helpers/mocks/job/job';
import { useJobData } from './Job.context';

describe('Job context', () => {
  beforeEach(() => {
    vi.restoreAllMocks();

    vi.mock('react-router-dom', async () => {
      const mod = await vi.importActual('react-router-dom');
      return {
        ...mod,
        useParams: () => ({
          projectId: 'projectId',
          jobId: 'jobId',
        }),
      };
    });
    vi.mock('@/data/api/ai/job/job.api', () => ({
      getJob: vi.fn(() => mockedJob),
    }));
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return job data when projectId in params', async () => {
    const { result } = renderHook(() => useJobData(), {
      wrapper: RouterWithQueryClientWrapper,
    });
    expect(result.current.projectId).toBe('projectId');
  });
});
