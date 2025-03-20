import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedJob } from '@/__tests__/helpers/mocks/job/job';
import RestartJobModal from './Restart.modal';

describe('Jobs list delete modal', () => {
  beforeEach(() => {
    vi.mock('@/data/api/ai/job/job.api', () => ({
      getJob: vi.fn(() => mockedJob),
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render restart modal', async () => {
    render(<RestartJobModal />, {
      wrapper: RouterWithQueryClientWrapper,
    });

    await waitFor(() => {
      expect(screen.getByTestId('restart-job-modal')).toBeInTheDocument();
      expect(
        screen.getByTestId('restart-job-submit-button'),
      ).toBeInTheDocument();
    });
  });
});
