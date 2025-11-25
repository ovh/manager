/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ReactNode } from 'react';
import { createContext } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import ListingPage from './Listing.page';

// Create mock ShellContext outside vi.mock for use in wrapper
const mockShellContextValue = {
  environment: {
    getUser: () => ({
      ovhSubsidiary: 'FR',
    }),
  },
};

const MockShellContext = createContext<any>(mockShellContextValue);

const mockTrackClick = vi.fn();
const mockOrderUrl = 'https://www.ovhcloud.com/dedicated/nasha/order';

// Mock dependencies
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, fallback?: string) => fallback || key,
  }),
}));

// Important: ShellContext must be exported from the mock
vi.mock('@ovh-ux/manager-react-shell-client', async () => {
  const MockContext = createContext({
    environment: {
      getUser: () => ({
        ovhSubsidiary: 'FR',
      }),
    },
  });

  return {
    ShellContext: MockContext,
    useOvhTracking: () => ({
      trackClick: mockTrackClick,
    }),
    useNavigationGetUrl: () => ({
      data: mockOrderUrl,
    }),
    PageLocation: { page: 'page' },
    ButtonType: { button: 'button', externalLink: 'externalLink' },
  };
});

vi.mock('@ovh-ux/manager-core-api', () => ({
  fetchIcebergV6: vi.fn().mockResolvedValue({
    data: [
      {
        serviceName: 'nasha-test-1',
        customName: 'My NAS 1',
        datacenter: 'gra',
        diskType: 'ssd',
        canCreatePartition: true,
        monitored: false,
        zpoolCapacity: 500,
        zpoolSize: 1000,
      },
      {
        serviceName: 'nasha-test-2',
        customName: 'My NAS 2',
        datacenter: 'rbx',
        diskType: 'hdd',
        canCreatePartition: false,
        monitored: true,
        zpoolCapacity: 800,
        zpoolSize: 2000,
      },
    ],
    totalCount: 2,
  }),
}));

vi.mock('@ovh-ux/muk', () => ({
  BaseLayout: ({ children, header }: any) => (
    <div data-testid="base-layout">
      <div data-testid="header-title">{header?.title}</div>
      <div data-testid="changelog-menu">{header?.changelogButton}</div>
      <div data-testid="guide-menu">{header?.guideMenu}</div>
      {children}
    </div>
  ),
  Button: ({ children, onClick }: any) => (
    <button data-testid="order-button" onClick={onClick}>
      {children}
    </button>
  ),
  ChangelogMenu: ({ links }: any) => (
    <div data-testid="changelog">
      {links.changelog && <span>changelog</span>}
    </div>
  ),
  GuideMenu: ({ items }: any) => (
    <div data-testid="guides">
      {items?.map((item: any) => (
        <a
          key={item.id}
          href={item.href}
          data-testid={`guide-link-${item.id}`}
          onClick={item.onClick}
        >
          {item.label}
        </a>
      ))}
    </div>
  ),
  Datagrid: ({ columns, data, totalCount, isLoading, topbar }: any) => (
    <div data-testid="datagrid">
      <div data-testid="datagrid-topbar">{topbar}</div>
      {isLoading && <div data-testid="loading">Loading...</div>}
      {!isLoading && (
        <>
          <div data-testid="total-count">Total: {totalCount}</div>
          <div data-testid="columns-count">Columns: {columns?.length}</div>
          <div data-testid="data-rows">
            {data?.map((row: any, index: number) => (
              <div key={row.serviceName} data-testid={`row-${index}`}>
                {row.serviceName} - {row.customName}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  ),
}));

vi.mock('@/hooks/listing/useListingColumns', () => ({
  useListingColumns: () => [
    { accessorKey: 'serviceName', header: 'listing:columns.serviceName' },
    { accessorKey: 'customName', header: 'listing:columns.customName' },
    { accessorKey: 'datacenter', header: 'listing:columns.datacenter' },
    { accessorKey: 'diskType', header: 'listing:columns.diskType' },
    { accessorKey: 'canCreatePartition', header: 'listing:columns.canCreatePartition' },
  ],
}));

// Test wrapper with QueryClient and ShellContext provider
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  // eslint-disable-next-line react/display-name
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <MockShellContext.Provider value={mockShellContextValue}>
        {children}
      </MockShellContext.Provider>
    </QueryClientProvider>
  );
};

describe('ListingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the listing page with BaseLayout', () => {
    render(<ListingPage />, { wrapper: createWrapper() });

    expect(screen.getByTestId('base-layout')).toBeInTheDocument();
  });

  it('should render header with title', () => {
    render(<ListingPage />, { wrapper: createWrapper() });

    expect(screen.getByTestId('header-title')).toHaveTextContent('listing:title');
  });

  it('should render the Datagrid component', () => {
    render(<ListingPage />, { wrapper: createWrapper() });

    expect(screen.getByTestId('datagrid')).toBeInTheDocument();
  });

  it('should render the order button in Datagrid topbar', () => {
    render(<ListingPage />, { wrapper: createWrapper() });

    expect(screen.getByTestId('order-button')).toBeInTheDocument();
    expect(screen.getByTestId('order-button')).toHaveTextContent('listing:order_button');
  });

  it('should render changelog menu', () => {
    render(<ListingPage />, { wrapper: createWrapper() });

    expect(screen.getByTestId('changelog-menu')).toBeInTheDocument();
    expect(screen.getByTestId('changelog')).toBeInTheDocument();
  });

  it('should render guide menu', () => {
    render(<ListingPage />, { wrapper: createWrapper() });

    expect(screen.getByTestId('guide-menu')).toBeInTheDocument();
    expect(screen.getByTestId('guides')).toBeInTheDocument();
  });

  it('should fetch and display NAS-HA services', async () => {
    render(<ListingPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByTestId('total-count')).toHaveTextContent('Total: 2');
    });

    expect(screen.getByTestId('row-0')).toHaveTextContent('nasha-test-1 - My NAS 1');
    expect(screen.getByTestId('row-1')).toHaveTextContent('nasha-test-2 - My NAS 2');
  });

  it('should pass correct columns to Datagrid', async () => {
    render(<ListingPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByTestId('columns-count')).toHaveTextContent('Columns: 5');
    });
  });

  it('should track click and redirect when order button is clicked', () => {
    const originalLocation = window.location;
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { ...originalLocation, href: '' },
    });

    render(<ListingPage />, { wrapper: createWrapper() });

    const orderButton = screen.getByTestId('order-button');
    fireEvent.click(orderButton);

    expect(mockTrackClick).toHaveBeenCalledWith({
      location: 'page',
      buttonType: 'button',
      actionType: 'action',
      actions: ['nasha', 'listing', 'add'],
    });

    expect(window.location.href).toBe(mockOrderUrl);

    Object.defineProperty(window, 'location', {
      writable: true,
      value: originalLocation,
    });
  });

  it('should track click when guide link is clicked', () => {
    render(<ListingPage />, { wrapper: createWrapper() });

    const guideLink = screen.getByTestId('guide-link-1');
    fireEvent.click(guideLink);

    expect(mockTrackClick).toHaveBeenCalledWith({
      location: 'page',
      buttonType: 'externalLink',
      actionType: 'navigation',
      actions: ['nasha', 'listing', 'guides'],
    });
  });

  it('should render guide link with correct URL for FR subsidiary', () => {
    render(<ListingPage />, { wrapper: createWrapper() });

    const guideLink = screen.getByTestId('guide-link-1');
    expect(guideLink).toHaveAttribute(
      'href',
      'https://help.ovhcloud.com/csm/fr-public-cloud-storage-nas-get-started?id=kb_article_view&sysparm_article=KB0046704',
    );
  });
});
