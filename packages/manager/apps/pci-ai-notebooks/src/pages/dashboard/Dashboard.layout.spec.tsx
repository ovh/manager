import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import DashboardLayout from '@/pages/dashboard/Dashboard.layout';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import * as appAPI from '@/data/api/ai/app/app.api';
import * as jobAPI from '@/data/api/ai/job/job.api';
import * as notebookAPI from '@/data/api/ai/notebook/notebook.api';
import { mockedJob } from '@/__tests__/helpers/mocks/job';
import { mockedNotebook } from '@/__tests__/helpers/mocks/notebook';
import { mockedPciDiscoveryProject } from '@/__tests__/helpers/mocks/project';
import { mockedApp } from '@/__tests__/helpers/mocks/app';

describe('Dashboard Layout', () => {
  beforeEach(() => {
    vi.restoreAllMocks();

    vi.mock('react-router-dom', async () => {
      const mod = await vi.importActual('react-router-dom');
      return {
        ...mod,
        useParams: () => ({
          projectId: 'projectId',
        }),
      };
    });

    vi.mock('@/data/api/project/project.api', () => ({
      getProject: vi.fn(() => mockedPciDiscoveryProject),
    }));

    vi.mock('@/data/api/ai/app/app.api', () => ({
      getApps: vi.fn(),
    }));
    vi.mock('@/data/api/ai/job/job.api', () => ({
      getJobs: vi.fn(),
    }));
    vi.mock('@/data/api/ai/notebook/notebook.api', () => ({
      getNotebooks: vi.fn(),
    }));

    const mockScrollIntoView = vi.fn();
    window.HTMLElement.prototype.scrollIntoView = mockScrollIntoView;
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders skeleton of dashboard Layout', async () => {
    render(<DashboardLayout />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(
        screen.getByTestId('dashboard-header-skeleton'),
      ).toBeInTheDocument();
      expect(appAPI.getApps).toHaveBeenCalled();
      expect(jobAPI.getJobs).toHaveBeenCalled();
      expect(notebookAPI.getNotebooks).toHaveBeenCalled();
    });
  });

  it('renders fully dashboard layout', async () => {
    vi.mocked(appAPI.getApps).mockResolvedValue([mockedApp]);
    vi.mocked(jobAPI.getJobs).mockResolvedValue([mockedJob]);
    vi.mocked(notebookAPI.getNotebooks).mockResolvedValue([mockedNotebook]);
    render(<DashboardLayout />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.getByTestId('discovery-container')).toBeInTheDocument();
      expect(screen.getByTestId('header-title')).toBeInTheDocument();
      expect(screen.getByText('homeTab')).toBeInTheDocument();
    });
  });
});
