import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import DashboardLayout from '@/pages/dashboard/dashboard.layout';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import * as appAPI from '@/data/api/apiApp';
import * as jobAPI from '@/data/api/apiJob';
import * as notebookAPI from '@/data/api/apiNotebook';
import { mockedApp } from '@/__tests__/helpers/mocks/app';
import { mockedJob } from '@/__tests__/helpers/mocks/job';
import { mockedNotebook } from '@/__tests__/helpers/mocks/notebook';

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

    vi.mock('@/data/api/apiApp', () => ({
      getApps: vi.fn(),
    }));
    vi.mock('@/data/api/apiJob', () => ({
      getJobs: vi.fn(),
    }));
    vi.mock('@/data/api/apiNotebook', () => ({
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
      expect(screen.getByTestId('header-title')).toBeInTheDocument();
      expect(screen.getByText('homeTab')).toBeInTheDocument();
    });
  });
});
