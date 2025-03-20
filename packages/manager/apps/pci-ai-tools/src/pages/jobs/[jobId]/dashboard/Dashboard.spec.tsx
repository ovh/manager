import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { UseQueryResult } from '@tanstack/react-query';
import { useToast } from '@datatr-ux/uxlib';
import ai from '@/types/AI';
import { mockedCommand } from '@/__tests__/helpers/mocks/shared/command';
import Dashboard from './Dashboard.page';
import * as jobApi from '@/data/api/ai/job/job.api';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { apiErrorMock } from '@/__tests__/helpers/mocks/shared/aiError';
import { mockedJob, mockedJobSpec } from '@/__tests__/helpers/mocks/job/job';

const mockedJobBis: ai.job.Job = {
  ...mockedJob,
  spec: {
    ...mockedJobSpec,
    labels: { key: 'label' },
  },
};

describe('Dashboard page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();

    vi.mock('@/data/api/ai/job/job.api', () => ({
      getCommand: vi.fn(() => mockedCommand),
    }));

    vi.mock('@/pages/jobs/[jobId]/Job.context', () => ({
      useJobData: vi.fn(() => ({
        projectId: 'projectId',
        job: mockedJobBis,
        jobQuery: {} as UseQueryResult<ai.job.Job, Error>,
      })),
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders Dashboard', async () => {
    render(<Dashboard />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('dashboard-container')).toBeInTheDocument();
  });

  it('renders Dashboard with toast error on API Error', async () => {
    vi.mocked(jobApi.getCommand).mockImplementation(() => {
      throw apiErrorMock;
    });
    render(<Dashboard />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('dashboard-container')).toBeInTheDocument();
    await waitFor(() => {
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'errorGetCommandCli',
        description: apiErrorMock.response.data.message,
        variant: 'destructive',
      });
    });
  });
});
