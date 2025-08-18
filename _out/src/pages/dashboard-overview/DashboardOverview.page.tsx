import { useMemo } from 'react';

import { Outlet } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { DataGridTextCell, Datagrid, useDataGrid } from '@ovh-ux/manager-react-components';

import { useListingData } from '@/data/hooks/dashboard-listing/useListingData';
import { useListingColumns } from '@/hooks/dashboard-listing/useListingColumns';
import type { ListingItemType } from '@/types/Listing.type';

export default function DashboardOverviewPage() {
  const { t } = useTranslation(['listing', 'common']);
  const { items, total, isLoading, hasNextPage, fetchNextPage } = useListingData<ListingItemType>();
  const baseColumns = useListingColumns<ListingItemType>();

  const columns = useMemo(() => {
    if (baseColumns.length > 0) {
      return baseColumns.map((c) => ({ ...c, label: t(String(c.label)) }));
    }

    const EMPTY = t('common:empty', '—');
    return [
      {
        id: 'auto',
        label: t('listing:auto_column', 'Result'),
        isSortable: false,
        cell: (row: ListingItemType) => (
          <DataGridTextCell>{row ? JSON.stringify(row) : EMPTY}</DataGridTextCell>
        ),
      },
    ];
  }, [baseColumns, t]);

  const initialSort = useMemo(() => ({ id: columns[0]?.id ?? 'auto', desc: false }), [columns]);

  const { sorting, setSorting } = useDataGrid(initialSort);

  return (
    <>
      <Datagrid
        columns={columns}
        items={items}
        totalItems={total}
        isLoading={isLoading}
        sorting={sorting}
        onSortChange={setSorting}
        hasNextPage={hasNextPage}
        onFetchNextPage={fetchNextPage}
        noResultLabel={t('listing:no_results', 'No results')}
      />
      <Outlet />
    </>
  );
}
