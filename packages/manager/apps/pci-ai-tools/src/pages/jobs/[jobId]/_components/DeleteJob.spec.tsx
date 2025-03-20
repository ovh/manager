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
import DeleteJob from './DeleteJob.component';
import { mockedJob } from '@/__tests__/helpers/mocks/job/job';

const onSuccess = vi.fn();
const onError = vi.fn();
describe('Delete job modal', () => {
  beforeEach(() => {
    vi.mock('@/data/api/ai/job/job.api', () => ({
      deleteJob: vi.fn(),
    }));
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should open the modal', async () => {
    render(<DeleteJob job={mockedJob} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.queryByTestId('delete-job-modal')).toBeInTheDocument();
    });
  });

  it('should delete the job on submit', async () => {
    render(<DeleteJob job={mockedJob} onSuccess={onSuccess} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    act(() => {
      fireEvent.click(screen.getByTestId('delete-job-submit-button'));
    });
    await waitFor(() => {
      expect(jobApi.deleteJob).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'jobToastSuccessTitle',
        description: 'deleteJobToastSuccessDescription',
      });
    });
    expect(onSuccess).toHaveBeenCalled();
  });

  it('should call onError when API fails', async () => {
    vi.mocked(jobApi.deleteJob).mockImplementation(() => {
      throw apiErrorMock;
    });
    render(<DeleteJob job={mockedJob} onError={onError} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    act(() => {
      fireEvent.click(screen.getByTestId('delete-job-submit-button'));
    });
    await waitFor(() => {
      expect(jobApi.deleteJob).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'jobToastErrorTitle',
        description: apiErrorMock.response.data.message,
        variant: 'destructive',
      });
      expect(onError).toHaveBeenCalled();
    });
  });
});
