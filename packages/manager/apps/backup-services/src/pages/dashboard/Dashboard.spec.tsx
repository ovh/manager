/* eslint-disable react/no-multi-comp */
import { ReactNode } from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import DashboardPage from './Dashboard.page';

// --- Mock react-router-dom ---
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLocation: () => ({ pathname: '/general-information/123' }),
    useParams: () => ({ id: '123' }),
    Outlet: () => <div data-testid="outlet" />,
    NavLink: ({ children, onClick }: { children: ReactNode; onClick?: () => void }) => (
      <button role="link" onClick={onClick}>
        {children}
      </button>
    ),
  };
});

// --- Mock translation ---
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// --- Mock OVH Tracking ---
const trackClick = vi.fn();
vi.mock('@ovh-ux/manager-react-shell-client', () => ({
  useOvhTracking: () => ({ trackClick }),
}));

// --- Mock BaseLayout + ODS Tabs ---
interface BaseLayoutProps {
  header: { title: string };
  backLinkLabel: string;
  onClickReturn: () => void;
  breadcrumb: ReactNode;
  tabs: ReactNode;
}
vi.mock('@ovh-ux/manager-react-components', () => ({
  BaseLayout: ({ header, backLinkLabel, onClickReturn, breadcrumb, tabs }: BaseLayoutProps) => (
    <div>
      <h1>{header.title}</h1>
      <button data-testid="back" onClick={onClickReturn}>
        {backLinkLabel}
      </button>
      <div data-testid="breadcrumb">{breadcrumb}</div>
      <div data-testid="tabs">{tabs}</div>
    </div>
  ),
  Breadcrumb: () => {
    const items = [{ label: 'Home' }, { label: 'Dashboard' }];
    return <nav data-testid="breadcrumb-nav">{items.map((i) => i.label).join(' / ')}</nav>;
  },
}));

interface OdsTabsProps {
  children: ReactNode;
}
interface OdsTabProps {
  children: ReactNode;
  isSelected?: boolean;
}
vi.mock('@ovhcloud/ods-components/react', () => ({
  OdsTabs: ({ children }: OdsTabsProps) => <div data-testid="ods-tabs">{children}</div>,
  OdsTab: ({ children, isSelected }: OdsTabProps) => (
    <div data-testid="ods-tab" data-selected={isSelected ? 'true' : 'false'}>
      {children}
    </div>
  ),
}));

// --- Mock useDashboardTabs ---
vi.mock('@/hooks/dashboard/useDashboardTabs', () => ({
  useDashboardTabs: () => [
    {
      name: 'general-information',
      title: 'dashboard:general-information',
      to: '/general-information/123',
      trackingActions: ['click::general-information-tab'],
    },
    {
      name: 'help',
      title: 'dashboard:help',
      to: '/help',
      trackingActions: ['click::help-tab'],
    },
  ],
}));

describe('DashboardPage', () => {
  beforeEach(() => {
    trackClick.mockClear();
  });

  it('renders layout with title, breadcrumb and tabs', () => {
    render(<DashboardPage />);
    expect(screen.getByText('dashboard:title')).toBeInTheDocument();
    expect(screen.getByTestId('breadcrumb-nav')).toHaveTextContent('Home / Dashboard');
    expect(screen.getAllByTestId('ods-tab')).toHaveLength(2);
  });

  it('marks the active tab as selected', () => {
    render(<DashboardPage />);
    const tabs = screen.getAllByTestId('ods-tab');
    expect(tabs[0]).toHaveAttribute('data-selected', 'true');
    expect(tabs[1]).toHaveAttribute('data-selected', 'false');
  });

  it('calls trackClick when a tab with trackingActions is clicked', () => {
    render(<DashboardPage />);
    const helpTab = screen.getByText('dashboard:help');
    fireEvent.click(helpTab);
    expect(trackClick).toHaveBeenCalledWith({ actions: ['click::help-tab'] });
  });

  it('renders the Outlet inside Suspense', () => {
    render(<DashboardPage />);
    expect(screen.getByTestId('outlet')).toBeInTheDocument();
  });
});
