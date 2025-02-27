import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedJob } from '@/__tests__/helpers/mocks/job/job';
import KillJobModal from './Kill.modal';

describe('Jobs list stop modal', () => {
  beforeEach(() => {
    vi.mock('@/data/api/ai/job/job.api', () => ({
      getJob: vi.fn(() => mockedJob),
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render stop modal', async () => {
    render(<KillJobModal />, {
      wrapper: RouterWithQueryClientWrapper,
    });

    await waitFor(() => {
      expect(screen.getByTestId('kill-job-modal')).toBeInTheDocument();
      expect(screen.getByTestId('stop-job-submit-button')).toBeInTheDocument();
    });
  });
});
