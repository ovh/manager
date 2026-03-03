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

const pendingJob: ai.job.Job = {
  ...mockedJob,
  status: {
    ...mockedJobStatus,
    state: ai.job.JobStateEnum.PENDING,
    timeoutAt: '2026-01-28T13:55:10Z',
    info: {
      ...mockedJobStatus.info,
      code: 'JOB_PENDING' as ai.InfoCodeEnum,
      message:
        'Warning: job is still looking for an available host (ranked 2 over 2 in the waiting queue for given flavor and count)',
    },
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
    expect(screen.getByTestId('job-header-skeleton')).toBeTruthy();
  });

  it('renders JobHeader and trigger stop modal', async () => {
    render(<JobHeader job={runningJob} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    expect(screen.getByTestId('job-header-container')).toBeTruthy();
    expect(screen.getByTestId('open-stop-modal-button')).toBeTruthy();

    fireEvent.click(screen.getByTestId('open-stop-modal-button'));
    await waitFor(() => {
      expect(screen.getByTestId('kill-job-modal')).toBeTruthy();
    });
    fireEvent.click(screen.getByTestId('stop-job-cancel-button'));
    await waitFor(() => {
      expect(screen.queryByTestId('kill-job-modal')).toBeNull();
    });
  });

  it('renders JobHeader and trigger restart modal', async () => {
    render(<JobHeader job={stroppedJob} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    expect(screen.getByTestId('job-header-container')).toBeTruthy();
    expect(screen.getByTestId('open-restart-modal-button')).toBeTruthy();
    expect(screen.queryByTestId('open-stop-modal-button')).toBeNull();

    fireEvent.click(screen.getByTestId('open-restart-modal-button'));
    await waitFor(() => {
      expect(screen.getByTestId('restart-job-modal')).toBeTruthy();
    });
    fireEvent.click(screen.getByTestId('restart-job-cancel-button'));
    await waitFor(() => {
      expect(screen.queryByTestId('restart-job-modal')).toBeNull();
    });
  });

  it('renders pending expiry information when job is waiting for resources', async () => {
    render(<JobHeader job={pendingJob} />, {
      wrapper: RouterWithQueryClientWrapper,
    });

    expect(screen.getByText('waitingResourceLabel')).toBeTruthy();

    fireEvent.click(screen.getByTestId('job-pending-timeout-info-trigger'));

    await waitFor(() => {
      expect(
        screen.getByText(
          'pendingTimeoutHint',
        ),
      ).toBeTruthy();
    });

    expect(
      screen.queryByText(
        'Warning: job is still looking for an available host (ranked 2 over 2 in the waiting queue for given flavor and count)',
      ),
    ).toBeNull();
  });
});
