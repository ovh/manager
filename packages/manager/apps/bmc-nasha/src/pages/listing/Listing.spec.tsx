import React, { ReactNode } from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

// --- Mock translation ---
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}));

// --- Mock router ---
const navigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => navigate,
}));

// --- Mock manager-react-components ---
interface BaseLayoutProps {
  header: { title: string };
  children?: ReactNode;
  breadcrumb?: ReactNode;
}

interface DataGridProps<T> {
  topbar?: ReactNode;
  columns: {
    id: string;
    label: string;
    isSortable?: boolean;
    cell?: (row: T) => ReactNode;
  }[];
  items: T[];
  totalItems: number;
  hasNextPage: boolean;
  onFetchNextPage?: () => void;
  isLoading: boolean;
  sorting?: { id: string; desc: boolean };
  onSortChange?: (sorting: { id: string; desc: boolean }) => void;
}

// Mock components
const MockBaseLayout = ({ header, children, breadcrumb }: BaseLayoutProps) => (
  <div>
    <h1>{header.title}</h1>
    <div data-testid="breadcrumb">{breadcrumb}</div>
    {children}
  </div>
);

const MockDatagrid = <T extends { id: string }>({
  topbar,
  columns,
  items,
  totalItems,
  hasNextPage,
  onFetchNextPage,
  isLoading,
}: DataGridProps<T>) => (
  <div>
    <div data-testid="topbar">{topbar}</div>
    <div data-testid="columns">{columns.map((c) => c.label).join(',')}</div>
    <div data-testid="items">{items.map((i) => i.id).join(',')}</div>
    <div data-testid="total">{totalItems}</div>
    <div data-testid="loading">{String(isLoading)}</div>
    {hasNextPage && (
      <button data-testid="fetch" onClick={onFetchNextPage}>
        fetch more
      </button>
    )}
  </div>
);

const MockDataGridTextCell = ({ children }: { children: ReactNode }) => (
  <span>{children}</span>
);

vi.mock('@ovh-ux/manager-react-components', () => ({
  BaseLayout: MockBaseLayout,
  Datagrid: MockDatagrid,
  DataGridTextCell: MockDataGridTextCell,
  useDataGrid: () => ({ sorting: [] as string[], setSorting: vi.fn() }),
}));

// --- Mock ODS components ---
const MockOsdsButton = ({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) => <button onClick={onClick}>{children}</button>;

vi.mock('@ovhcloud/ods-components/react', () => ({
  OsdsButton: MockOsdsButton,
}));
vi.mock('@ovhcloud/ods-components', () => ({
  ODS_BUTTON_SIZE: { md: 'md' },
  ODS_ICON_NAME: { network: 'network' },
}));

// --- Mock hooks ---
vi.mock('@/hooks/layout/useBreadcrumb', () => ({
  useBreadcrumb: () => [{ label: 'home' }],
}));
vi.mock('@/hooks/listing/useListingColumns', () => ({
  useListingColumns: () => [
    {
      id: 'serviceName',
      label: 'listing:serviceName',
      isSortable: true,
      cell: (row: { serviceName: string }) => row.serviceName,
    },
    {
      id: 'canCreatePartition',
      label: 'listing:canCreatePartition',
      isSortable: false,
      cell: (row: { canCreatePartition: boolean }) =>
        String(row.canCreatePartition),
    },
    {
      id: 'customName',
      label: 'listing:customName',
      isSortable: false,
      cell: (row: { customName: string }) => row.customName,
    },
    {
      id: 'datacenter',
      label: 'listing:datacenter',
      isSortable: false,
      cell: (row: { datacenter: string }) => row.datacenter,
    },
    {
      id: 'diskType',
      label: 'listing:diskType',
      isSortable: false,
      cell: (row: { diskType: string }) => row.diskType,
    },
    {
      id: 'monitored',
      label: 'listing:monitored',
      isSortable: false,
      cell: (row: { monitored: boolean }) => String(row.monitored),
    },
  ],
}));
vi.mock('@/data/hooks/useResources', () => ({
  useListingData: () => ({
    items: [
      {
        id: '1',
        serviceName: 'nasha-1',
        canCreatePartition: true,
        customName: 'Test 1',
        datacenter: 'GRA11',
        diskType: 'SSD',
        monitored: true,
      },
      {
        id: '2',
        serviceName: 'nasha-2',
        canCreatePartition: false,
        customName: 'Test 2',
        datacenter: 'SBG5',
        diskType: 'HDD',
        monitored: false,
      },
    ],
    total: 2,
    isLoading: false,
    hasNextPage: true,
    fetchNextPage: vi.fn(),
  }),
}));

// --- Mock Breadcrumb ---
vi.mock('@/components/breadcrumb/Breadcrumb.component', () => ({
  default: ({ items }: { items: { label: string }[] }) => (
    <nav>{items.map((i) => i.label).join('/')}</nav>
  ),
}));

// --- Tests ---
describe('ListingPage', () => {
  afterEach(() => {
    vi.resetModules();
  });

  it('renders header and breadcrumb', async () => {
    const { default: ListingPage } = await import('./Listing.page');
    render(<ListingPage />);
    expect(screen.getByText('listing:title')).toBeInTheDocument();
    expect(screen.getByTestId('breadcrumb')).toHaveTextContent('home');
  });

  it('renders datagrid with columns and items', async () => {
    const { default: ListingPage } = await import('./Listing.page');
    render(<ListingPage />);
    expect(screen.getByTestId('columns')).toHaveTextContent(
      'listing:serviceName',
    );
    expect(screen.getByTestId('items')).toHaveTextContent('1,2');
    expect(screen.getByTestId('total')).toHaveTextContent('2');
  });

  it('navigates to dashboard when button clicked', async () => {
    const { default: ListingPage } = await import('./Listing.page');
    render(<ListingPage />);
    fireEvent.click(screen.getByText('listing:open'));
    expect(navigate).toHaveBeenCalledWith('../dashboard');
  });

  it('shows order button', async () => {
    const { default: ListingPage } = await import('./Listing.page');
    render(<ListingPage />);
    expect(screen.getByText('listing:order')).toBeInTheDocument();
  });

  it('calls fetchNextPage when clicking fetch button', async () => {
    const fetchNextPage = vi.fn();
    vi.doMock('@/data/hooks/useResources', () => ({
      useListingData: () => ({
        items: [
          {
            id: '1',
            serviceName: 'nasha-1',
            canCreatePartition: true,
            customName: 'Test 1',
            datacenter: 'GRA11',
            diskType: 'SSD',
            monitored: true,
          },
        ],
        total: 1,
        isLoading: false,
        hasNextPage: true,
        fetchNextPage,
      }),
    }));

    const { default: Page } = await import('./Listing.page');
    render(<Page />);
    fireEvent.click(screen.getByTestId('fetch'));
    expect(fetchNextPage).toHaveBeenCalled();
  });

  it('renders fallback auto column if no baseColumns', async () => {
    vi.doMock('@/hooks/listing/useListingColumns', () => ({
      useListingColumns: () => [],
    }));

    const { default: Page } = await import('./Listing.page');
    render(<Page />);
    expect(screen.getByTestId('columns')).toHaveTextContent(
      'listing:auto_column',
    );
  });
});
