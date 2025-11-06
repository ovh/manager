import React, { PropsWithChildren } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { useDashboardData } from '@/hooks/dashboard/useDashboardData';
import type { DashboardData } from '@/types/Dashboard.type';

import DashboardPage from '../Dashboard.page';

// Mock dependencies
vi.mock('@/hooks/dashboard/useDashboardData');
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ serviceName: 'nasha-test-1' }),
  };
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapper = ({ children }: PropsWithChildren) => (
  <QueryClientProvider client={queryClient}>
    <MemoryRouter>{children}</MemoryRouter>
  </QueryClientProvider>
);

describe('DashboardPage', () => {
  const mockDashboardData: DashboardData = {
    nasha: {
      serviceName: 'nasha-test-1',
      customName: 'My Nasha',
      datacenter: 'rbx',
      localeDatacenter: 'Roubaix',
      diskType: 'hdd',
      diskSize: '1000 GB',
      zpoolSize: 1000,
      monitored: true,
      use: {
        size: { value: 1000, unit: 'GB', name: 'Taille' },
        used: { value: 500, unit: 'GB', name: 'Stockage' },
        usedbysnapshots: { value: 100, unit: 'GB', name: 'Snapshots' },
      },
    },
    serviceInfo: {
      serviceType: 'DEDICATED_NASHA',
      engagedUpTo: '2024-12-31',
      status: 'active',
    },
    partitionAllocatedSize: 450,
    canCreatePartitions: true,
    isCommitmentAvailable: true,
    isNashaEolServiceBannerAvailable: true,
    shouldReengage: false,
    nashaApiUrl: '/dedicated/nasha/nasha-test-1',
  };

  const mockNavigation = {
    goToEditName: vi.fn(),
    goToPartitionsCreate: vi.fn(),
    reload: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  it('should render loading state', () => {
    vi.mocked(useDashboardData).mockReturnValue({
      data: undefined,
      navigation: mockNavigation,
      isLoading: true,
      isError: false,
      error: null,
    });

    render(<DashboardPage />, { wrapper });

    // Spinner should be rendered
    expect(screen.getByRole('status') || screen.queryByText(/loading/i)).toBeDefined();
  });

  it('should render error state', () => {
    const mockError = new Error('Failed to load data');
    vi.mocked(useDashboardData).mockReturnValue({
      data: undefined,
      navigation: mockNavigation,
      isLoading: false,
      isError: true,
      error: mockError,
    });

    render(<DashboardPage />, { wrapper });

    expect(screen.getByText(/errors.load_failed/)).toBeInTheDocument();
  });

  it('should render dashboard with all components when data is loaded', async () => {
    vi.mocked(useDashboardData).mockReturnValue({
      data: mockDashboardData,
      navigation: mockNavigation,
      isLoading: false,
      isError: false,
      error: null,
    });

    render(<DashboardPage />, { wrapper });

    await waitFor(() => {
      // Check that main content is rendered
      expect(screen.getByText('My Nasha')).toBeInTheDocument();
      expect(screen.getByText('nasha-test-1')).toBeInTheDocument();
    });

    // Check that tiles are rendered
    expect(screen.getByText(/information.title/)).toBeInTheDocument();
    expect(screen.getByText(/configuration.title/)).toBeInTheDocument();
  });

  it('should render EOL banner when isNashaEolServiceBannerAvailable is true', async () => {
    vi.mocked(useDashboardData).mockReturnValue({
      data: mockDashboardData,
      navigation: mockNavigation,
      isLoading: false,
      isError: false,
      error: null,
    });

    render(<DashboardPage />, { wrapper });

    await waitFor(() => {
      expect(
        screen.getByText(/eol_lv1_lv2_services_banner_description_part_1/),
      ).toBeInTheDocument();
    });
  });

  it('should not render EOL banner when isNashaEolServiceBannerAvailable is false', async () => {
    const dataWithoutEol = {
      ...mockDashboardData,
      isNashaEolServiceBannerAvailable: false,
    };

    vi.mocked(useDashboardData).mockReturnValue({
      data: dataWithoutEol,
      navigation: mockNavigation,
      isLoading: false,
      isError: false,
      error: null,
    });

    render(<DashboardPage />, { wrapper });

    await waitFor(() => {
      expect(
        screen.queryByText(/eol_lv1_lv2_services_banner_description_part_1/),
      ).not.toBeInTheDocument();
    });
  });
});

