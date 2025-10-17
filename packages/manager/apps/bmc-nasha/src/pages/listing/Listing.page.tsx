import React, { Suspense, startTransition, useMemo } from 'react';

import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_BUTTON_SIZE } from '@ovhcloud/ods-components';
import { OdsButton } from '@ovhcloud/ods-components/react';

import {
  BaseLayout,
  DataGridTextCell,
  Datagrid,
  ManagerButton,
  useDataGrid,
} from '@ovh-ux/manager-react-components';

import { APP_FEATURES, appName } from '@/App.constants';
import Breadcrumb from '@/components/breadcrumb/Breadcrumb.component';
import { useListingData } from '@/data/hooks/useResources';
import { useBreadcrumb } from '@/hooks/layout/useBreadcrumb';
import { useListingColumns } from '@/hooks/listing/useListingColumns';
import { urls } from '@/routes/Routes.constants';
import { ListingItemType } from '@/types/Listing.type';

/**
 * NASHA Listing Page Component
 * Displays a list of NASHA services with sorting, pagination, and actions
 * Migrated from AngularJS directory module to React/TypeScript
 */
export default function ListingPage() {
  const { t } = useTranslation(['common', 'listing']);
  const navigate = useNavigate();

  const breadcrumbItems = useBreadcrumb({
    rootLabel: t('common:home'),
    appName,
  });

  const {
    items,
    total,
    isLoading,
    hasNextPage,
    fetchNextPage,
  } = useListingData<ListingItemType>(APP_FEATURES.listingEndpoint);

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
          <DataGridTextCell>
            {row ? JSON.stringify(row) : EMPTY}
          </DataGridTextCell>
        ),
      },
    ];
  }, [baseColumns, t]);

  // Default sort by serviceName (first column) as in the original
  const initialSort = useMemo(
    () => ({ id: 'serviceName', desc: false }),
    [],
  );
  const { sorting, setSorting } = useDataGrid(initialSort);

  const totalItems = Number.isFinite(total) ? total : items.length;

  /**
   * Navigate to dashboard page
   * Equivalent to the original 'Open dashboard' functionality
   */
  const onNavigateToDashboardClicked = () => {
    startTransition(() => navigate(`../${urls.dashboard}`));
  };

  /**
   * Handle order button click
   * Equivalent to the original 'Order a HA-NAS' functionality
   */
  const onOrderClicked = () => {
    // TODO: Implement order functionality
    // Navigate to order page or open order modal
    // This should match the original AngularJS order flow
    console.log('Order NASHA clicked - to be implemented');
  };

  return (
    <BaseLayout
      breadcrumb={<Breadcrumb items={breadcrumbItems} />}
      header={{ title: t('listing:title') }}
    >
      <Suspense fallback={<div>Loading...</div>}>
        {columns && (
          <Datagrid
            topbar={
              <div
                style={{
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'center',
                  justifyContent: 'flex-start'
                }}
              >
                <ManagerButton
                  id="order-nasha"
                  label={t('listing:order')}
                  onClick={onOrderClicked}
                  variant="primary"
                />
                <OdsButton
                  size={ODS_BUTTON_SIZE.md}
                  onClick={onNavigateToDashboardClicked}
                  label={t('listing:open')}
                  variant="secondary"
                >
                  {t('listing:open')}
                </OdsButton>
              </div>
            }
            columns={columns}
            items={items || []}
            totalItems={totalItems || 0}
            hasNextPage={hasNextPage && !isLoading}
            onFetchNextPage={fetchNextPage}
            sorting={sorting}
            onSortChange={setSorting}
            isLoading={isLoading}
            emptyMessage={t('listing:empty_message', 'No NASHA services found')}
          />
        )}
      </Suspense>
    </BaseLayout>
  );
}
