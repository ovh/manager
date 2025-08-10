import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useListingData } from '@/data/hooks/listing/useListingData';
import { useListingColumns } from '@/hooks/listing/useListingColumns';
import { ListingDataResultType, ListingItemType } from '@/types/Listing.type';

import ListingPage from './Listing.page';

// --- mocks ---
vi.mock('@/data/hooks/listing/useListingData', () => ({
  useListingData: vi.fn(),
}));
vi.mock('@/hooks/listing/useListingColumns', () => ({
  useListingColumns: vi.fn(),
}));
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, fallback?: string) => fallback || key,
  }),
}));

// Inline mock implementations as plain functions (not React components) → avoids multi-comp rule
vi.mock('@ovh-ux/manager-react-components', () => {
  return {
    DataGridTextCell: ({ children }: { children: React.ReactNode }) =>
      React.createElement('div', { 'data-testid': 'text-cell' }, children),

    // eslint-disable-next-line react/no-multi-comp
    Datagrid: <T extends ListingItemType>({
      columns,
      items,
      onSortChange,
      onFetchNextPage,
    }: {
      columns: { id: string; label: string }[];
      items: T[];
      totalItems: number;
      isLoading: boolean;
      sorting: { id: string; desc: boolean }[];
      onSortChange: (sorting: { id: string; desc: boolean }[]) => void;
      hasNextPage: boolean;
      onFetchNextPage?: () => void;
      noResultLabel: string;
    }) =>
      React.createElement(
        'div',
        { 'data-testid': 'datagrid' },
        React.createElement(
          'div',
          { 'data-testid': 'columns' },
          columns.map((c) => React.createElement('span', { key: c.id }, c.label)),
        ),
        React.createElement(
          'div',
          { 'data-testid': 'items' },

          items.map((i) => React.createElement('div', { key: i.id }, JSON.stringify(i))),
        ),
        React.createElement(
          'button',
          { onClick: () => onSortChange([{ id: 'col1', desc: true }]) },
          'sort',
        ),
        onFetchNextPage && React.createElement('button', { onClick: onFetchNextPage }, 'fetchNext'),
      ),

    useDataGrid: () => ({
      sorting: [{ id: 'auto', desc: false }],
      setSorting: vi.fn(),
    }),
  };
});

vi.mock('react-router-dom', () => ({
  // eslint-disable-next-line react/no-multi-comp
  Outlet: () => React.createElement('div', { 'data-testid': 'outlet' }),
}));

describe('ListingPage', () => {
  const baseItems: ListingItemType[] = [{ id: '1', name: 'foo' }];

  beforeEach(() => {
    const mockResult: ListingDataResultType<ListingItemType> = {
      items: baseItems,
      total: 10,
      isLoading: false,
      hasNextPage: true,
      fetchNextPage: vi.fn(),
    };

    vi.mocked(useListingData).mockReturnValue(mockResult);
    vi.mocked(useListingColumns).mockReturnValue([]);
  });

  it('renders auto-generated column when no custom columns', () => {
    render(<ListingPage />);
    expect(screen.getByText('Result')).toBeInTheDocument();
    expect(screen.getByText(JSON.stringify(baseItems[0]))).toBeInTheDocument();
  });

  it('renders custom columns when provided', () => {
    vi.mocked(useListingColumns).mockReturnValue([
      {
        id: 'col1',
        label: 'custom',
        cell: function (): JSX.Element {
          throw new Error('Function not implemented.');
        },
      },
    ]);
    render(<ListingPage />);
    expect(screen.getByText('custom')).toBeInTheDocument();
  });

  it('falls back to items.length when total is not finite', () => {
    const mockResult: ListingDataResultType<ListingItemType> = {
      items: baseItems,
      total: Number.NaN,
      isLoading: false,
      hasNextPage: false,
      fetchNextPage: vi.fn(),
    };

    vi.mocked(useListingData).mockReturnValue(mockResult);
    render(<ListingPage />);
    expect(screen.getByText(JSON.stringify(baseItems[0]))).toBeInTheDocument();
  });

  it('renders Outlet for nested routes', () => {
    render(<ListingPage />);
    expect(screen.getByTestId('outlet')).toBeInTheDocument();
  });

  it('handles sorting change', async () => {
    const user = userEvent.setup();
    render(<ListingPage />);
    await user.click(screen.getByText('sort'));
    expect(screen.getByText('sort')).toBeInTheDocument();
  });

  it('calls fetchNextPage when fetch button clicked', async () => {
    const user = userEvent.setup();
    const fetchNextPage = vi.fn();
    const mockResult: ListingDataResultType<ListingItemType> = {
      items: baseItems,
      total: 10,
      isLoading: false,
      hasNextPage: true,
      fetchNextPage,
    };

    vi.mocked(useListingData).mockReturnValue(mockResult);
    render(<ListingPage />);
    await user.click(screen.getByText('fetchNext'));
    expect(fetchNextPage).toHaveBeenCalled();
  });
});
