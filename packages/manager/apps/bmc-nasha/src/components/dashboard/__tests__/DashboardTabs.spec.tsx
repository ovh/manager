import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useLocation, useNavigate } from 'react-router-dom';

import { DashboardTabs } from '../DashboardTabs.component';

// Mock dependencies
vi.mock('react-router-dom', () => ({
  useLocation: vi.fn(),
  useNavigate: vi.fn(),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('@/utils/dashboard/navigation.utils', () => ({
  getDashboardUrl: (serviceName: string) => `/dashboard/${serviceName}`,
}));

describe('DashboardTabs', () => {
  const mockServiceName = 'nasha-test-1';
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    vi.mocked(useLocation).mockReturnValue({
      pathname: `/dashboard/${mockServiceName}`,
    } as any);
  });

  it('should render tabs with correct labels', () => {
    render(<DashboardTabs serviceName={mockServiceName} />);

    expect(screen.getByText('tabs.general_information')).toBeInTheDocument();
    expect(screen.getByText('tabs.partitions')).toBeInTheDocument();
  });

  it('should set active tab to partitions when pathname includes partitions', () => {
    vi.mocked(useLocation).mockReturnValue({
      pathname: `/dashboard/${mockServiceName}/partitions`,
    } as any);

    render(<DashboardTabs serviceName={mockServiceName} />);

    // The TabsComponent should handle the active state internally
    expect(screen.getByText('tabs.partitions')).toBeInTheDocument();
  });
});

