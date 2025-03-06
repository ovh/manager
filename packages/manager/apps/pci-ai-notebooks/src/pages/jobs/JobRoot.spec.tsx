import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import Root, { Loader } from '@/pages/jobs/JobRoot.page';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import * as jobApi from '@/data/api/ai/job/job.api';
import { mockedJob } from '@/__tests__/helpers/mocks/job/job';

const JobProps = {
  params: {
    projectId: 'projectId',
  },
  request: new Request('https://my-api.com/endpoint'),
};

describe('Home page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.mock('@/data/api/ai/job/job.api', () => ({
      getJobs: vi.fn(() => []),
    }));
  });

  it('fetches job data', async () => {
    Loader(JobProps);
    await waitFor(() => {
      expect(jobApi.getJobs).toHaveBeenCalled();
    });
  });

  it('should display job page', async () => {
    vi.mocked(jobApi.getJobs).mockResolvedValue([mockedJob]);
    render(<Root />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('jobs-guides-container')).toBeInTheDocument();
    });
  });
});
