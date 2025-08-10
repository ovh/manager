import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// after mocks
import DashboardPage from './Dashboard.page';

// mocks
vi.mock('react-router-dom', () => ({
  NavLink: ({
    to,
    children,
    onClick,
  }: {
    to: string;
    children: React.ReactNode;
    onClick: () => void;
  }) => (
    <a href={to} data-testid={`navlink-${to}`} onClick={onClick}>
      {children}
    </a>
  ),
  // eslint-disable-next-line react/no-multi-comp
  Outlet: () => <div data-testid="outlet" />,
  useLocation: () => ({ pathname: '/dashboard/overview' }),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, fallback?: string) => fallback || key,
  }),
}));

vi.mock('@ovhcloud/ods-components/react', () => ({
  // eslint-disable-next-line react/no-multi-comp
  OdsTabs: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="ods-tabs">{children}</div>
  ),
  // eslint-disable-next-line react/no-multi-comp
  OdsTab: ({ isSelected, children }: { isSelected: boolean; children: React.ReactNode }) => (
    <div data-testid={isSelected ? 'ods-tab-active' : 'ods-tab'}>{children}</div>
  ),
}));

vi.mock('@ovh-ux/manager-react-components', () => ({
  // eslint-disable-next-line react/no-multi-comp
  BaseLayout: ({ header, breadcrumb, tabs }: never) => (
    <div data-testid="base-layout">
      <div data-testid="header">{JSON.stringify(header)}</div>
      <div data-testid="breadcrumb">{breadcrumb}</div>
      <div data-testid="tabs">{tabs}</div>
    </div>
  ),
}));

const trackClick = vi.fn();
vi.mock('@ovh-ux/manager-react-shell-client', () => ({
  useOvhTracking: () => ({ trackClick }),
}));

vi.mock('@/components/breadcrumb/Breadcrumb.component', () => ({
  default: ({ items }: { items: string[] }) => (
    <div data-testid="breadcrumb-component">{items.join(' / ')}</div>
  ),
}));

vi.mock('@/hooks/breadcrumb/useBreadcrumb', () => ({
  useBreadcrumb: () => ['Home', 'Dashboard'],
}));
vi.mock('@/hooks/dashboard/useDashboardHeader', () => ({
  useDashboardHeader: () => ({ title: 'Dashboard Header' }),
}));
vi.mock('@/hooks/dashboard/useDashboardTabs', () => ({
  useDashboardTabs: () => [
    {
      name: 'overview',
      title: 'Overview',
      to: '/dashboard/overview',
      trackingActions: ['click::overview'],
    },
    { name: 'settings', title: 'Settings', to: '/dashboard/settings' },
  ],
}));

describe('DashboardPage', () => {
  beforeEach(() => {
    trackClick.mockClear();
  });

  it('renders BaseLayout with header, breadcrumb, and tabs', () => {
    render(<DashboardPage />);
    expect(screen.getByTestId('base-layout')).toBeInTheDocument();
    expect(screen.getByTestId('breadcrumb-component')).toHaveTextContent('Home / Dashboard');
    expect(screen.getByTestId('ods-tabs')).toBeInTheDocument();
    expect(screen.getByTestId('ods-tab-active')).toHaveTextContent('Overview');
  });

  it('marks the correct tab as active based on location', () => {
    render(<DashboardPage />);
    expect(screen.getByTestId('ods-tab-active')).toHaveTextContent('Overview');
    expect(screen.getByTestId('ods-tab')).toHaveTextContent('Settings');
  });

  it('tracks click when clicking on a tab with trackingActions', async () => {
    const user = userEvent.setup();
    render(<DashboardPage />);
    await user.click(screen.getByTestId('navlink-/dashboard/overview'));
    expect(trackClick).toHaveBeenCalledWith({ actions: ['click::overview'] });
  });

  it('renders Outlet wrapped in Suspense', () => {
    render(<DashboardPage />);
    expect(screen.getByTestId('outlet')).toBeInTheDocument();
  });
});
