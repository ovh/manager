import { fireEvent } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { ListingItemType } from '@/types/Listing.type';
import { renderWithRouter } from '@/utils/Test.utils';

import DashboardOverviewPage from './DashboardOverview.page';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue?: string) => defaultValue ?? key,
  }),
}));

type DatagridProps = {
  columns: Array<{ id: string; label: string }>;
  items: ListingItemType[];
  totalItems: number;
  isLoading: boolean;
  hasNextPage?: boolean;
  onFetchNextPage?: () => void;
  sorting: unknown;
  onSortChange: (s: unknown) => void;
  noResultLabel?: string;
};

const datagridPropsSpy = vi.fn<(props: DatagridProps) => void>();

vi.mock('@ovh-ux/manager-react-components', () => ({
  DataGridTextCell: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
  // eslint-disable-next-line react/no-multi-comp
  Datagrid: (props: DatagridProps) => {
    datagridPropsSpy(props);
    return <button data-testid="fetch" onClick={() => props.onFetchNextPage?.()} />;
  },
  useDataGrid: () => ({ sorting: { id: 'auto', desc: false }, setSorting: vi.fn() }),
}));

const fetchNextPageSpy = vi.fn();

vi.mock('@/data/hooks/dashboard-listing/useListingData', () => ({
  useListingData: vi.fn(() => ({
    items: [
      { id: '1', name: 'Alpha', status: 'active' },
      { id: '2', name: 'Beta', status: 'pending' },
    ] as ListingItemType[],
    total: 2,
    isLoading: false,
    hasNextPage: true,
    fetchNextPage: fetchNextPageSpy,
  })),
}));

type Column<T = unknown> = {
  id: string;
  label: string;
  isSortable?: boolean;
  cell: (row: T) => React.ReactNode;
};

const useListingColumnsMock = vi.fn<() => Column<never>[]>(() => []);

vi.mock('@/hooks/dashboard-listing/useListingColumns', () => ({
  useListingColumns: <T,>(): Column<T>[] => useListingColumnsMock() as unknown as Column<T>[],
}));

afterEach(() => {
  vi.clearAllMocks();
  datagridPropsSpy.mockClear();
  fetchNextPageSpy.mockClear();
  useListingColumnsMock.mockReset();
});

describe('DashboardOverviewPage (typed, clean)', () => {
  it('maps non-empty base columns through t() and forwards list props', () => {
    useListingColumnsMock.mockReturnValue([
      { id: 'name', label: 'listing:col.name', isSortable: true, cell: () => null },
      { id: 'status', label: 'listing:col.status', isSortable: false, cell: () => null },
    ]);

    renderWithRouter(<DashboardOverviewPage />);

    const call = datagridPropsSpy.mock.calls.at(-1)![0];

    expect(call.columns.map((c) => c.label)).toEqual(['listing:col.name', 'listing:col.status']);
    expect(call.items).toHaveLength(2);
    expect(call.totalItems).toBe(2);
    expect(call.isLoading).toBe(false);
    expect(call.hasNextPage).toBe(true);
  });

  it('falls back to an auto column when no base columns', () => {
    useListingColumnsMock.mockReturnValue([]);

    renderWithRouter(<DashboardOverviewPage />);

    const { columns } = datagridPropsSpy.mock.calls.at(-1)![0];

    expect(columns).toHaveLength(1);
    const first = columns[0]!;
    expect(first.id).toBe('auto');
    expect(first.label).toBe('Result');
  });

  it('wires onFetchNextPage to the hook function', () => {
    useListingColumnsMock.mockReturnValue([]);

    const { getByTestId } = renderWithRouter(<DashboardOverviewPage />);

    fireEvent.click(getByTestId('fetch'));
    expect(fetchNextPageSpy).toHaveBeenCalledTimes(1);
  });
});
