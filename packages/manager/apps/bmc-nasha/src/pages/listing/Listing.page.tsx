import React, { Suspense, useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import {
  BaseLayout,
  DataGridTextCell,
  Datagrid,
  useDataGrid,
} from '@ovh-ux/manager-react-components';

import { APP_FEATURES } from '@/App.constants';
import { useListingData } from '@/data/hooks/useResources';
import { useListingColumns } from '@/hooks/listing/useListingColumns';
import { ListingItemType } from '@/types/Listing.type';

export default function ListingPage() {
  const { t } = useTranslation(['common', 'listing']);

  const { items, total, isLoading, hasNextPage, fetchNextPage } = useListingData<ListingItemType>(
    APP_FEATURES.listingEndpoint,
  );

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

  const totalItems = Number.isFinite(total) ? total : items.length;

  return (
    <BaseLayout header={{ title: t('listing:title') }}>
      <Suspense>
        {columns && (
          <Datagrid
            columns={columns}
            items={items || []}
            totalItems={totalItems || 0}
            hasNextPage={hasNextPage && !isLoading}
            onFetchNextPage={fetchNextPage}
            sorting={sorting}
            onSortChange={setSorting}
            isLoading={isLoading}
          />
        )}
      </Suspense>
    </BaseLayout>
  );
}
