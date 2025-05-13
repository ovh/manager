import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedCurrentUsage } from '@/__tests__/helpers/mocks/shared/currentUsage';
import { mockedAuthorization } from '@/__tests__/helpers/mocks/shared/authorization';
import { mockedCapabilitiesRegionGRA } from '@/__tests__/helpers/mocks/capabilities/region';
import Home from '../Home.page';

describe('Home page', () => {
  beforeEach(() => {
    vi.mock('@/data/api/ai/app.api', () => ({
      getApps: vi.fn(() => []),
    }));
    vi.mock('@/data/api/ai/notebook.api', () => ({
      getNotebooks: vi.fn(() => []),
    }));
    vi.mock('@/data/api/ai/job.api', () => ({
      getJobs: vi.fn(() => []),
    }));
    vi.mock('@/data/api/ai/capabilities.api', () => ({
      getRegions: vi.fn(() => [mockedCapabilitiesRegionGRA]),
    }));

    vi.mock('@/data/api/usage/usage.api', () => ({
      getCurrentUsage: vi.fn(() => mockedCurrentUsage),
    }));

    vi.mock('@/pages/dashboard/Dashboard.context', () => ({
      useDashboardData: vi.fn(() => ({
        projectId: 'projectId',
        notebooks: [],
        apps: [],
        jobs: [],
      })),
    }));

    vi.mock('@/data/api/ai/authorization.api', () => ({
      getAuthorization: vi.fn(() => [mockedAuthorization]),
    }));
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders and shows Home Page with Skeleton wguke loading', async () => {
    render(<Home />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('home-page-skeleton')).toBeTruthy();
    });
  });

  it('renders and shows Home Page with Onboarding', async () => {
    render(<Home />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('onboarding-card')).toBeTruthy();
    });
  });
});
