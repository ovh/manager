import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

import ListingPage from './Listing.page';
import { ListingItemType } from '@/types/Listing.type';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, fallback?: string) => {
      const translations: Record<string, string> = {
        'common:home': 'Home',
        'listing:title': 'NAS-HA',
        'listing:order': 'Order a HA-NAS',
        'listing:open': 'Open dashboard',
        'listing:empty_message': 'No NASHA services found',
        'listing:serviceName': 'Service ID',
        'listing:canCreatePartition': 'Partition creation',
        'listing:canCreatePartition_true': 'Allowed',
        'listing:canCreatePartition_false': 'Not allowed',
        'listing:customName': 'Name',
        'listing:datacenter': 'Datacentre location',
        'listing:diskType': 'Disk type',
        'listing:monitored': 'Monitored',
        'listing:monitored_true': 'Yes',
        'listing:monitored_false': 'No',
        'listing:zpoolCapacity': 'Zpool capacity',
        'listing:zpoolSize': 'Zpool size',
      };
      return translations[key] || fallback || key;
    },
  }),
}));

// Mock hooks
const mockUseListingData = vi.fn();
const mockUseBreadcrumb = vi.fn();

vi.mock('@/data/hooks/useResources', () => ({
  useListingData: () => mockUseListingData(),
}));

vi.mock('@/hooks/layout/useBreadcrumb', () => ({
  useBreadcrumb: () => mockUseBreadcrumb(),
}));

// Mock components with proper accessibility attributes
vi.mock('@/components/breadcrumb/Breadcrumb.component', () => ({
  default: ({ items }: { items: any[] }) => (
    <nav data-testid="breadcrumb" aria-label="Breadcrumb">
      <ol>
        {items.map((item, index) => (
          <li key={index}>
            <a href="#" aria-current={index === items.length - 1 ? 'page' : undefined}>
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  ),
}));

vi.mock('@ovh-ux/manager-react-components', () => ({
  BaseLayout: ({ children, breadcrumb, header }: any) => (
    <div data-testid="base-layout">
      {breadcrumb}
      <h1>{header.title}</h1>
      {children}
    </div>
  ),
  Datagrid: ({ columns, items, topbar, isLoading, emptyMessage }: any) => (
    <div data-testid="datagrid">
      {topbar}
      {isLoading ? (
        <div data-testid="loading" role="status" aria-live="polite">Loading...</div>
      ) : items.length === 0 ? (
        <div data-testid="empty" role="status" aria-live="polite">{emptyMessage}</div>
      ) : (
        <table role="table" aria-label="NASHA services list">
          <thead>
            <tr role="row">
              {columns.map((col: any) => (
                <th key={col.id} role="columnheader" scope="col">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item: any, index: number) => (
              <tr key={index} role="row">
                {columns.map((col: any) => (
                  <td key={col.id} role="cell">
                    {col.cell ? col.cell(item) : item[col.id]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  ),
  ManagerButton: ({ id, label, onClick, variant }: any) => (
    <button
      data-testid={id}
      onClick={onClick}
      data-variant={variant}
      aria-label={label}
      type="button"
    >
      {label}
    </button>
  ),
  useDataGrid: () => ({
    sorting: { id: 'serviceName', desc: false },
    setSorting: vi.fn(),
  }),
}));

vi.mock('@ovhcloud/ods-components/react', () => ({
  OdsButton: ({ children, onClick, variant, size }: any) => (
    <button
      data-testid="ods-button"
      onClick={onClick}
      data-variant={variant}
      data-size={size}
      aria-label={children}
      type="button"
    >
      {children}
    </button>
  ),
}));

const mockListingData: ListingItemType[] = [
  {
    id: 'zpool-123456',
    serviceName: 'zpool-123456',
    canCreatePartition: true,
    customName: 'Test NAS',
    datacenter: 'rbx',
    diskType: 'ssd',
    monitored: true,
    zpoolCapacity: 1073741824, // 1GB
    zpoolSize: 2147483648, // 2GB
  },
];

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('ListingPage — a11y', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUseListingData.mockReturnValue({
      items: mockListingData,
      total: 1,
      isLoading: false,
      hasNextPage: false,
      fetchNextPage: vi.fn(),
    });

    mockUseBreadcrumb.mockReturnValue([
      { label: 'Home' },
      { label: 'NAS-HA' },
    ]);
  });

  it('has no accessibility violations when displaying data', async () => {
    const { container } = render(
      <TestWrapper>
        <ListingPage />
      </TestWrapper>
    );

    await expect(container).toBeAccessible();
  });

  it('has no accessibility violations when loading', async () => {
    mockUseListingData.mockReturnValue({
      items: [],
      total: 0,
      isLoading: true,
      hasNextPage: false,
      fetchNextPage: vi.fn(),
    });

    const { container } = render(
      <TestWrapper>
        <ListingPage />
      </TestWrapper>
    );

    await expect(container).toBeAccessible();
  });

  it('has no accessibility violations when empty', async () => {
    mockUseListingData.mockReturnValue({
      items: [],
      total: 0,
      isLoading: false,
      hasNextPage: false,
      fetchNextPage: vi.fn(),
    });

    const { container } = render(
      <TestWrapper>
        <ListingPage />
      </TestWrapper>
    );

    await expect(container).toBeAccessible();
  });

  it('has proper heading structure', () => {
    render(
      <TestWrapper>
        <ListingPage />
      </TestWrapper>
    );

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('NAS-HA');
  });

  it('has accessible buttons with proper labels', () => {
    render(
      <TestWrapper>
        <ListingPage />
      </TestWrapper>
    );

    const orderButton = screen.getByRole('button', { name: 'Order a HA-NAS' });
    const openButton = screen.getByRole('button', { name: 'Open dashboard' });

    expect(orderButton).toBeInTheDocument();
    expect(openButton).toBeInTheDocument();
  });

  it('has accessible table with proper structure', () => {
    render(
      <TestWrapper>
        <ListingPage />
      </TestWrapper>
    );

    const table = screen.getByRole('table', { name: 'NASHA services list' });
    expect(table).toBeInTheDocument();

    const columnHeaders = screen.getAllByRole('columnheader');
    expect(columnHeaders).toHaveLength(8); // All columns should have headers

    const cells = screen.getAllByRole('cell');
    expect(cells.length).toBeGreaterThan(0);
  });

  it('has accessible breadcrumb navigation', () => {
    render(
      <TestWrapper>
        <ListingPage />
      </TestWrapper>
    );

    const breadcrumb = screen.getByRole('navigation', { name: 'Breadcrumb' });
    expect(breadcrumb).toBeInTheDocument();

    const breadcrumbLinks = screen.getAllByRole('link');
    expect(breadcrumbLinks.length).toBeGreaterThan(0);
  });

  it('has proper loading and empty state announcements', () => {
    // Test loading state
    mockUseListingData.mockReturnValue({
      items: [],
      total: 0,
      isLoading: true,
      hasNextPage: false,
      fetchNextPage: vi.fn(),
    });

    const { rerender } = render(
      <TestWrapper>
        <ListingPage />
      </TestWrapper>
    );

    const loadingStatus = screen.getByRole('status', { name: /loading/i });
    expect(loadingStatus).toHaveAttribute('aria-live', 'polite');

    // Test empty state
    mockUseListingData.mockReturnValue({
      items: [],
      total: 0,
      isLoading: false,
      hasNextPage: false,
      fetchNextPage: vi.fn(),
    });

    rerender(
      <TestWrapper>
        <ListingPage />
      </TestWrapper>
    );

    const emptyStatus = screen.getByRole('status', { name: /no nasha services found/i });
    expect(emptyStatus).toHaveAttribute('aria-live', 'polite');
  });
});

