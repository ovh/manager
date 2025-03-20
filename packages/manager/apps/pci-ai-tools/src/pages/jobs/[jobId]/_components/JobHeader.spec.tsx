import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ai from '@/types/AI';

import { mockedJob, mockedJobStatus } from '@/__tests__/helpers/mocks/job/job';
import { JobHeader } from './JobHeader.component';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';

const runningJob: ai.job.Job = {
  ...mockedJob,
  status: {
    ...mockedJobStatus,
    state: ai.job.JobStateEnum.RUNNING,
  },
};

const stroppedJob: ai.job.Job = {
  ...mockedJob,
  status: {
    ...mockedJobStatus,
    state: ai.job.JobStateEnum.DONE,
  },
};
describe('AppHeader component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders JobHeader and trigger stop modal', async () => {
    render(<JobHeader.Skeleton />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    expect(screen.getByTestId('job-header-skeleton')).toBeInTheDocument();
  });

  it('renders JobHeader and trigger stop modal', async () => {
    render(<JobHeader job={runningJob} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    expect(screen.getByTestId('job-header-container')).toBeInTheDocument();
    expect(screen.getByTestId('open-stop-modal-button')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('open-stop-modal-button'));
    await waitFor(() => {
      expect(screen.getByTestId('kill-job-modal')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('stop-job-cancel-button'));
    await waitFor(() => {
      expect(screen.queryByTestId('kill-job-modal')).not.toBeInTheDocument();
    });
  });

  it('renders JobHeader and trigger restart modal', async () => {
    render(<JobHeader job={stroppedJob} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    expect(screen.getByTestId('job-header-container')).toBeInTheDocument();
    expect(screen.getByTestId('open-restart-modal-button')).toBeInTheDocument();
    expect(
      screen.queryByTestId('open-stop-modal-button'),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId('open-restart-modal-button'));
    await waitFor(() => {
      expect(screen.getByTestId('restart-job-modal')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('restart-job-cancel-button'));
    await waitFor(() => {
      expect(screen.queryByTestId('restart-job-modal')).not.toBeInTheDocument();
    });
  });
});
