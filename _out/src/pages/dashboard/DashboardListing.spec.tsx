import { fireEvent, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { renderWithLayout } from '@/utils/Test.utils';

import DashboardListing from './DashboardListing.page';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}));

const trackClickMockLocal = vi.fn<(arg: { actions: string[] }) => void>();
vi.mock('@ovh-ux/manager-react-shell-client', () => ({
  useOvhTracking: () => ({ trackClick: trackClickMockLocal }),
}));

vi.mock('@/hooks/breadcrumb/useBreadcrumb', () => ({
  useBreadcrumb: vi.fn(() => [{ label: 'common:home', to: '/' }]),
}));

vi.mock('@/hooks/dashboard-header/useDashboardHeader', () => ({
  useDashboardHeader: vi.fn(() => ({ title: 'Dashboard Header' })),
}));

type Tab = { name: string; title: string; to: string; trackingActions?: string[] };
const useDashboardTabsMockLocal = vi.fn<() => Tab[]>(() => []);
vi.mock('@/hooks/dashboard-tabs/useDashboardTabs', () => ({
  useDashboardTabs: () => useDashboardTabsMockLocal(),
}));

vi.mock('@/components/breadcrumb/Breadcrumb.component', () => ({
  __esModule: true,
  default: ({ items }: { items: { label: string }[] }) => (
    <nav data-testid="breadcrumb">{items.map((i) => i.label).join(',')}</nav>
  ),
}));

vi.mock('@ovhcloud/ods-components/react', () => ({
  OdsTabs: ({ children }: { children: React.ReactNode }) => <div role="tablist">{children}</div>,
  // eslint-disable-next-line react/no-multi-comp
  OdsTab: ({ isSelected, children }: { isSelected?: boolean; children: React.ReactNode }) => (
    <div role="tab" aria-selected={isSelected ? 'true' : 'false'}>
      {children}
    </div>
  ),
}));

vi.mock('@ovh-ux/manager-react-components', () => ({
  // eslint-disable-next-line react/no-multi-comp
  BaseLayout: ({
    header,
    breadcrumb,
    tabs,
  }: {
    header?: { title?: string };
    breadcrumb?: React.ReactNode;
    tabs?: React.ReactNode;
  }) => (
    <div>
      <div data-testid="header">{header?.title}</div>
      <div data-testid="bl-breadcrumb">{breadcrumb}</div>
      <div data-testid="bl-tabs">{tabs ?? null}</div>
    </div>
  ),
}));

afterEach(() => {
  vi.clearAllMocks();
});

describe('DashboardListing', () => {
  it('renders tabs and marks the active one from location', () => {
    useDashboardTabsMockLocal.mockReturnValue([
      { name: 'overview', title: 'Overview', to: '/overview' },
      { name: 'settings', title: 'Settings', to: '/settings' },
    ]);

    renderWithLayout('/overview', <DashboardListing />);

    expect(screen.getByTestId('breadcrumb')).toHaveTextContent('common:home');

    expect(screen.getByRole('tablist')).toBeInTheDocument();
    const overview = screen.getByRole('tab', { name: 'Overview' });
    const settings = screen.getByRole('tab', { name: 'Settings' });

    expect(overview).toHaveAttribute('aria-selected', 'true');
    expect(settings).toHaveAttribute('aria-selected', 'false');
  });

  it('tracks click when tab has trackingActions', () => {
    useDashboardTabsMockLocal.mockReturnValue([
      { name: 'tracked', title: 'Tracked Tab', to: '/tracked', trackingActions: ['a1', 'a2'] },
    ]);

    renderWithLayout('/', <DashboardListing />);

    const trackedTab = screen.getByRole('tab', { name: 'Tracked Tab' });
    fireEvent.click(trackedTab);

    expect(trackClickMockLocal).toHaveBeenCalledWith({ actions: ['a1', 'a2'] });
  });

  it('renders without tabs when the hook returns empty array', () => {
    useDashboardTabsMockLocal.mockReturnValue([]);

    renderWithLayout('/overview', <DashboardListing />);

    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();

    const tabsContainer = screen.getByTestId('bl-tabs');
    expect(tabsContainer).toBeEmptyDOMElement();
  });

  it('renders Outlet content (child route) below the layout', () => {
    useDashboardTabsMockLocal.mockReturnValue([
      { name: 'overview', title: 'Overview', to: '/overview' },
    ]);

    renderWithLayout('/overview', <DashboardListing />);

    expect(screen.getByText('Overview Page')).toBeInTheDocument();
  });
});
