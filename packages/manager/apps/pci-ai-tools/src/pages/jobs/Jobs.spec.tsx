import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { mockedUsedNavigate } from '@/__tests__/helpers/mockRouterDomHelper';
import { mockManagerReactShellClient } from '@/__tests__/helpers/mockShellHelper';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedJob } from '@/__tests__/helpers/mocks/job/job';
import Jobs from './Jobs.page';
import { openButtonInMenu } from '@/__tests__/helpers/unitTestHelper';

describe('Jobs List page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockedUsedNavigate();
    mockManagerReactShellClient();

    vi.mock('@/data/api/ai/job/job.api', () => ({
      getJobs: vi.fn(() => [mockedJob]),
    }));
  });

  it('should display Jobs pages and skeleton', async () => {
    render(<Jobs />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('jobs-list-table-skeleton')).toBeTruthy();
    await waitFor(() => {
      expect(screen.getByTestId('guide-skeleton')).toBeTruthy();
    });
  });

  it('should display jobs list table and add button', async () => {
    render(<Jobs />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('create-job-button')).toBeTruthy();
      expect(screen.getByText(mockedJob.id)).toBeTruthy();
      expect(screen.getByText(mockedJob.spec.name)).toBeTruthy();
    });
  });

  it('open start job modal from action table button', async () => {
    render(<Jobs />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText(mockedJob.id)).toBeTruthy();
    });
    await openButtonInMenu('jobs-action-trigger', 'job-action-restart-button');
    expect(mockedUsedNavigate).toHaveBeenCalledWith('./restart/jobId');
  });

  it('open kill job modal from action table button', async () => {
    render(<Jobs />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText(mockedJob.id)).toBeTruthy();
    });
    await openButtonInMenu('jobs-action-trigger', 'job-action-stop-button');
    expect(mockedUsedNavigate).toHaveBeenCalledWith('./stop/jobId');
  });

  it('open delete notebook Modal from action table button', async () => {
    render(<Jobs />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText(mockedJob.id)).toBeTruthy();
    });
    await openButtonInMenu('jobs-action-trigger', 'job-action-delete-button');
    expect(mockedUsedNavigate).toHaveBeenCalledWith('./delete/jobId');
  });

  it('go to manage job from action table button', async () => {
    render(<Jobs />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText(mockedJob.id)).toBeTruthy();
    });
    await openButtonInMenu('jobs-action-trigger', 'job-action-manage-button');
    expect(mockedUsedNavigate).toHaveBeenCalledWith('./jobId');
  });
});
