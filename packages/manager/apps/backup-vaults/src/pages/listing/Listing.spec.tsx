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
}

vi.mock('@ovh-ux/manager-react-components', () => ({
  BaseLayout: ({ header, children, breadcrumb }: BaseLayoutProps) => (
    <div>
      <h1>{header.title}</h1>
      <div data-testid="breadcrumb">{breadcrumb}</div>
      {children}
    </div>
  ),
  // eslint-disable-next-line react/no-multi-comp
  Datagrid: <T extends { id: string }>({
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
  ),
  // eslint-disable-next-line react/no-multi-comp
  DataGridTextCell: ({ children }: { children: ReactNode }) => <span>{children}</span>,
  useDataGrid: () => ({ sorting: [] as string[], setSorting: vi.fn() }),
}));

// --- Mock ODS components ---
vi.mock('@ovhcloud/ods-components/react', () => ({
  // eslint-disable-next-line react/no-multi-comp
  OdsButton: ({ label, onClick }: { label: string; onClick: () => void }) => (
    <button onClick={onClick}>{label}</button>
  ),
}));
vi.mock('@ovhcloud/ods-components', () => ({
  ODS_BUTTON_SIZE: { md: 'md' },
  ODS_ICON_NAME: { network: 'network' },
}));

// --- Mock hooks ---
vi.mock('@/hooks/listing/useListingColumns', () => ({
  useListingColumns: () => [
    {
      id: 'id',
      label: 'listing:id',
      isSortable: true,
      cell: (row: { id: string }) => row.id,
    },
  ],
}));
vi.mock('@/data/hooks/useResources', () => ({
  useListingData: () => ({
    items: [{ id: '1' }, { id: '2' }],
    total: 2,
    isLoading: false,
    hasNextPage: true,
    fetchNextPage: vi.fn(),
  }),
}));

// --- Mock Breadcrumb ---
vi.mock('@/components/breadcrumb/Breadcrumb.component', () => ({
  default: () => {
    const items = [{ label: 'home' }];
    return <nav>{items.map((i) => i.label).join('/')}</nav>;
  },
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
    expect(screen.getByTestId('columns')).toHaveTextContent('listing:id');
    expect(screen.getByTestId('items')).toHaveTextContent('1,2');
    expect(screen.getByTestId('total')).toHaveTextContent('2');
  });

  it('navigates to dashboard when button clicked', async () => {
    const { default: ListingPage } = await import('./Listing.page');
    render(<ListingPage />);
    fireEvent.click(screen.getByText('listing:open'));
    expect(navigate).toHaveBeenCalledWith('../dashboard');
  });

  it('calls fetchNextPage when clicking fetch button', async () => {
    const fetchNextPage = vi.fn();
    vi.doMock('@/data/hooks/useResources', () => ({
      useListingData: () => ({
        items: [{ id: '1' }],
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
    expect(screen.getByTestId('columns')).toHaveTextContent('listing:auto_column');
  });
});
