import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { UseQueryResult } from '@tanstack/react-query';
import * as ai from '@/types/cloud/project/ai';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import Logs, { breadcrumb as Breadcrumb } from './Logs.page';
import { mockedLogs } from '@/__tests__/helpers/mocks/logs';
import { mockedJob } from '@/__tests__/helpers/mocks/job';

describe('Logs page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();

    vi.mock('@/pages/jobs/[jobId]/Job.context', () => ({
      useJobData: vi.fn(() => ({
        projectId: 'projectId',
        job: mockedJob,
        jobQuery: {} as UseQueryResult<ai.job.Job, Error>,
      })),
    }));

    vi.mock('@/data/api/ai/job/logs/logs.api', () => ({
      getLogs: vi.fn(() => mockedLogs),
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the breadcrumb component', async () => {
    const translationKey = 'breadcrumb';
    render(<Breadcrumb />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText(translationKey)).toBeInTheDocument();
    });
  });

  it('renders skeleton while loading', async () => {
    render(<Logs />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('skeleton-container')).toBeInTheDocument();
  });

  it('renders Logs', async () => {
    render(<Logs />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('logs-area')).toBeInTheDocument();
  });
});
