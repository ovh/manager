import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import DeleteJobModal from './Delete.modal';
import { mockedJob } from '@/__tests__/helpers/mocks/job/job';

describe('Job dashboard delete modal', () => {
  beforeEach(() => {
    vi.mock('@/data/api/ai/job/job.api', () => ({
      getJob: vi.fn(() => mockedJob),
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render delete modal', async () => {
    render(<DeleteJobModal />, {
      wrapper: RouterWithQueryClientWrapper,
    });

    await waitFor(() => {
      expect(screen.getByTestId('delete-job-modal')).toBeInTheDocument();
      expect(
        screen.getByTestId('delete-job-submit-button'),
      ).toBeInTheDocument();
    });
  });
});
