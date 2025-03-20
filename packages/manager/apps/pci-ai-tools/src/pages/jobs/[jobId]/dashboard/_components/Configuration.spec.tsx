import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { useToast } from '@datatr-ux/uxlib';
import { UseQueryResult } from '@tanstack/react-query';
import { mockedUsedNavigate } from '@/__tests__/helpers/mockRouterDomHelper';
import ai from '@/types/AI';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import Configurations from './Configuration.component';
import { mockedJob, mockedJobStatus } from '@/__tests__/helpers/mocks/job/job';

describe('Configuration component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockedUsedNavigate();
    vi.mock('@/pages/jobs/[jobId]/Job.context', () => ({
      useJobData: vi.fn(() => ({
        projectId: 'projectId',
        job: {
          ...mockedJob,
          status: {
            ...mockedJobStatus,
            state: ai.job.JobStateEnum.INTERRUPTED,
          },
        },
        jobQuery: {} as UseQueryResult<ai.job.Job, Error>,
      })),
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders Configuration', async () => {
    render(<Configurations />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('configuration-container')).toBeInTheDocument();
  });

  it('renders and trigger copy Id in clipboard', async () => {
    Object.assign(window.navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
      },
    });
    render(<Configurations />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText(mockedJob.id)).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('dashboard-copy-id-button'));
    });
    await waitFor(() => {
      expect(window.navigator.clipboard.writeText).toHaveBeenCalledWith(
        mockedJob.id,
      );
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'jobIdCopyToast',
      });
    });
  });

  it('open delete job modal', async () => {
    render(<Configurations />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('job-config-delete-button')).not.toBeDisabled();
    act(() => {
      fireEvent.click(screen.getByTestId('job-config-delete-button'));
    });
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('./delete');
    });
  });
});
