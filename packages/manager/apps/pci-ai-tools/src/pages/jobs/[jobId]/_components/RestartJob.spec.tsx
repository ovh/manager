import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from '@testing-library/react';
import { useToast } from '@datatr-ux/uxlib';
import * as jobApi from '@/data/api/ai/job/job.api';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { apiErrorMock } from '@/__tests__/helpers/mocks/shared/aiError';
import RestartJob from './RestartJob.component';
import { mockedJob } from '@/__tests__/helpers/mocks/job/job';

describe('Restart job modal', () => {
  beforeEach(() => {
    vi.mock('@/data/api/ai/job/job.api', () => ({
      addJob: vi.fn(() => mockedJob),
    }));
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  const onSuccess = vi.fn();
  const onError = vi.fn();
  it('should open the modal', async () => {
    render(<RestartJob job={mockedJob} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.queryByTestId('restart-job-modal')).toBeTruthy();
    });
  });

  it('should restart the job on submit', async () => {
    render(<RestartJob job={mockedJob} onSuccess={onSuccess} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    act(() => {
      fireEvent.click(screen.getByTestId('restart-job-submit-button'));
    });
    await waitFor(() => {
      expect(jobApi.addJob).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'jobToastSuccessTitle',
        description: 'restartJobToastSuccessDescription',
      });
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it('should call onError when API fails', async () => {
    vi.mocked(jobApi.addJob).mockImplementation(() => {
      throw apiErrorMock;
    });
    render(<RestartJob job={mockedJob} onError={onError} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    act(() => {
      fireEvent.click(screen.getByTestId('restart-job-submit-button'));
    });
    await waitFor(() => {
      expect(jobApi.addJob).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'jobToastErrorTitle',
        description: apiErrorMock.response.data.message,
        variant: 'destructive',
      });
      expect(onError).toHaveBeenCalled();
    });
  });
});
