import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedApp } from '@/__tests__/helpers/mocks/app/app';
import { mockedNotebook } from '@/__tests__/helpers/mocks/notebook/notebook';
import { mockedJob } from '@/__tests__/helpers/mocks/job/job';
import { mockedCurrentUsage } from '@/__tests__/helpers/mocks/shared/currentUsage';
import { mockedCapabilitiesRegionGRA } from '@/__tests__/helpers/mocks/capabilities/region';
import Home from './Home.page';

describe('Home page', () => {
  beforeEach(() => {
    vi.mock('@/data/api/ai/app.api', () => ({
      getApps: vi.fn(() => [mockedApp]),
    }));
    vi.mock('@/data/api/ai/notebook.api', () => ({
      getNotebooks: vi.fn(() => [mockedNotebook]),
    }));
    vi.mock('@/data/api/ai/job.api', () => ({
      getJobs: vi.fn(() => [mockedJob]),
    }));

    vi.mock('@/data/api/usage/usage.api', () => ({
      getCurrentUsage: vi.fn(() => mockedCurrentUsage),
    }));

    vi.mock('@/pages/dashboard/Dashboard.context', () => ({
      useDashboardData: vi.fn(() => ({
        projectId: 'projectId',
        notebooks: [mockedNotebook],
        apps: [mockedApp],
        jobs: [mockedJob],
      })),
    }));

    vi.mock('@/data/api/ai/capabilities.api', () => ({
      getRegions: vi.fn(() => [mockedCapabilitiesRegionGRA]),
    }));
  });
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('renders and shows Home Page', async () => {
    render(<Home />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('product-life-card')).toBeInTheDocument();
    });
  });
});
