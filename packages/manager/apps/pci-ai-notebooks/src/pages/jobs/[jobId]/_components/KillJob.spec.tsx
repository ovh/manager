import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from '@testing-library/react';
import * as jobApi from '@/data/api/ai/job/job.api';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { useToast } from '@/components/ui/use-toast';
import { apiErrorMock } from '@/__tests__/helpers/mocks/aiError';
import KillJob from './KillJob.component';
import { mockedJob } from '@/__tests__/helpers/mocks/job';

describe('Stop job modal', () => {
  beforeEach(() => {
    vi.mock('@/data/api/ai/job/job.api', () => ({
      killJob: vi.fn((job) => job),
    }));
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  const onSuccess = vi.fn();
  const onError = vi.fn();
  it('should open the modal', async () => {
    render(<KillJob job={mockedJob} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.queryByTestId('kill-job-modal')).toBeInTheDocument();
    });
  });

  it('should stop the job on submit', async () => {
    render(<KillJob job={mockedJob} onSuccess={onSuccess} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    act(() => {
      fireEvent.click(screen.getByTestId('stop-job-submit-button'));
    });
    await waitFor(() => {
      expect(jobApi.killJob).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'jobToastSuccessTitle',
        description: 'stopJobToastSuccessDescription',
      });
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it('should call onError when API fails', async () => {
    vi.mocked(jobApi.killJob).mockImplementation(() => {
      throw apiErrorMock;
    });
    render(<KillJob job={mockedJob} onError={onError} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    act(() => {
      fireEvent.click(screen.getByTestId('stop-job-submit-button'));
    });
    await waitFor(() => {
      expect(jobApi.killJob).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'jobToastErrorTitle',
        description: apiErrorMock.response.data.message,
        variant: 'destructive',
      });
      expect(onError).toHaveBeenCalled();
    });
  });
});
