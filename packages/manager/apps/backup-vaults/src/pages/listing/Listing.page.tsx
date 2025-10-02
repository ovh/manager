import React, { Suspense, startTransition, useMemo } from 'react';

import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_BUTTON_SIZE, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { OdsButton } from '@ovhcloud/ods-components/react';

import {
  BaseLayout,
  DataGridTextCell,
  Datagrid,
  useDataGrid,
} from '@ovh-ux/manager-react-components';

import { APP_FEATURES } from '@/App.constants';
import Breadcrumb from '@/components/breadcrumb/Breadcrumb.component';
import { useListingData } from '@/data/hooks/useResources';
import { useListingColumns } from '@/hooks/listing/useListingColumns';
import { urls } from '@/routes/Routes.constants';
import { ListingItemType } from '@/types/Listing.type';

export default function ListingPage() {
  const { t } = useTranslation(['common', 'listing']);
  const navigate = useNavigate();

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

  const onNavigateToDashboardClicked = () => {
    startTransition(() => navigate(`../${urls.dashboard}`));
  };

  return (
    <BaseLayout breadcrumb={<Breadcrumb />} header={{ title: t('listing:title') }}>
      <Suspense>
        {columns && (
          <Datagrid
            topbar={
              <OdsButton
                icon={ODS_ICON_NAME.network}
                size={ODS_BUTTON_SIZE.md}
                label={t('listing:open')}
                onClick={onNavigateToDashboardClicked}
              />
            }
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
