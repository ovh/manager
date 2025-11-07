import { useCallback, useMemo } from 'react';

import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_BUTTON_SIZE, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { OdsButton } from '@ovhcloud/ods-components/react';

import { BaseLayout, DataGridTextCell, Datagrid, Links } from '@ovh-ux/manager-react-components';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { APP_FEATURES } from '@/App.constants';
import { useResources } from '@/data/hooks/useResources';
import { urls } from '@/routes/Routes.constants';
import type { NashaListingItem } from '@/types/Listing.type';

const NASHA_TITLE = 'NAS-HA';

export default function ListingPage() {
  const { t } = useTranslation(['listing', 'common']);
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();

  // Cell renderers - defined with useCallback to use hooks
  const DatagridServiceNameCell = useCallback(
    (item: NashaListingItem) => {
      return (
        <DataGridTextCell>
          <Links
            onClickReturn={() =>
              navigate(`../${urls.dashboard.replace(':serviceName', item.serviceName)}`)
            }
            label={item.serviceName}
          />
        </DataGridTextCell>
      );
    },
    [navigate],
  );

  const DatagridCanCreatePartitionCell = useCallback(
    (item: NashaListingItem) => {
      const value = item.canCreatePartition ?? false;
      return (
        <DataGridTextCell>
          {t(`listing:columns.canCreatePartitionValues.${String(value)}`)}
        </DataGridTextCell>
      );
    },
    [t],
  );

  const DatagridCustomNameCell = useCallback((item: NashaListingItem) => {
    return <DataGridTextCell>{item.customName || '-'}</DataGridTextCell>;
  }, []);

  const DatagridDatacenterCell = useCallback((item: NashaListingItem) => {
    return <DataGridTextCell>{item.datacenter}</DataGridTextCell>;
  }, []);

  const DatagridDiskTypeCell = useCallback((item: NashaListingItem) => {
    return <DataGridTextCell>{item.diskType}</DataGridTextCell>;
  }, []);

  const DatagridMonitoredCell = useCallback(
    (item: NashaListingItem) => {
      const value = item.monitored ?? false;
      return (
        <DataGridTextCell>{t(`listing:columns.monitoredValues.${String(value)}`)}</DataGridTextCell>
      );
    },
    [t],
  );

  const DatagridZpoolCapacityCell = useCallback((item: NashaListingItem) => {
    return <DataGridTextCell>{item.zpoolCapacity ?? '-'}</DataGridTextCell>;
  }, []);

  const DatagridZpoolSizeCell = useCallback((item: NashaListingItem) => {
    return <DataGridTextCell>{item.zpoolSize ?? '-'}</DataGridTextCell>;
  }, []);

  const columns = useMemo(
    () => [
      {
        id: 'serviceName',
        accessorKey: 'serviceName',
        label: t('listing:columns.serviceName'),
        isSortable: true,
        isSearchable: true,
        isFilterable: true,
        enableHiding: false,
        cell: DatagridServiceNameCell,
      },
      {
        id: 'canCreatePartition',
        accessorKey: 'canCreatePartition',
        label: t('listing:columns.canCreatePartition'),
        isSortable: true,
        isFilterable: true,
        enableHiding: false,
        cell: DatagridCanCreatePartitionCell,
      },
      {
        id: 'customName',
        accessorKey: 'customName',
        label: t('listing:columns.customName'),
        isSortable: true,
        isSearchable: true,
        isFilterable: true,
        enableHiding: false,
        cell: DatagridCustomNameCell,
      },
      {
        id: 'datacenter',
        accessorKey: 'datacenter',
        label: t('listing:columns.datacenter'),
        isSortable: true,
        isFilterable: true,
        enableHiding: false,
        cell: DatagridDatacenterCell,
      },
      {
        id: 'diskType',
        accessorKey: 'diskType',
        label: t('listing:columns.diskType'),
        isSortable: true,
        isFilterable: true,
        enableHiding: false,
        cell: DatagridDiskTypeCell,
      },
      {
        id: 'monitored',
        accessorKey: 'monitored',
        label: t('listing:columns.monitored'),
        isSortable: true,
        isFilterable: true,
        enableHiding: true,
        cell: DatagridMonitoredCell,
      },
      {
        id: 'zpoolCapacity',
        accessorKey: 'zpoolCapacity',
        label: t('listing:columns.zpoolCapacity'),
        isSortable: true,
        isFilterable: true,
        enableHiding: true,
        cell: DatagridZpoolCapacityCell,
      },
      {
        id: 'zpoolSize',
        accessorKey: 'zpoolSize',
        label: t('listing:columns.zpoolSize'),
        isSortable: true,
        isFilterable: true,
        enableHiding: true,
        cell: DatagridZpoolSizeCell,
      },
    ],
    [
      t,
      DatagridServiceNameCell,
      DatagridCanCreatePartitionCell,
      DatagridCustomNameCell,
      DatagridDatacenterCell,
      DatagridDiskTypeCell,
      DatagridMonitoredCell,
      DatagridZpoolCapacityCell,
      DatagridZpoolSizeCell,
    ],
  );

  const {
    flattenData,
    totalCount,
    hasNextPage,
    fetchNextPage,
    isLoading,
    sorting,
    setSorting,
    filters,
    search,
  } = useResources<NashaListingItem>({
    route: APP_FEATURES.listingEndpoint,
    queryKey: ['nasha', 'listing'],
    pageSize: 20,
  });

  const handleOrderClick = () => {
    trackClick({
      actionType: 'action',
      actions: ['nasha::directory::add'],
    });
    navigate('../order');
  };

  const header = {
    title: NASHA_TITLE,
  };

  // Safety check: ensure all required props are available
  if (!columns || columns.length === 0) {
    return (
      <BaseLayout header={header}>
        <div>Loading columns...</div>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout header={header}>
      <div className="flex flex-col gap-4">
        <div>
          <OdsButton
            color={ODS_THEME_COLOR_INTENT.primary}
            variant={ODS_BUTTON_VARIANT.outline}
            size={ODS_BUTTON_SIZE.sm}
            onClick={handleOrderClick}
            inline
          >
            {t('listing:order.label')}
          </OdsButton>
        </div>
        <Datagrid
          columns={columns}
          items={flattenData || []}
          totalItems={totalCount || 0}
          hasNextPage={hasNextPage && !isLoading}
          onFetchNextPage={fetchNextPage || (() => {})}
          sorting={
            sorting && setSorting
              ? {
                  sorting: sorting || [],
                  onSortChange: setSorting,
                  manualSorting: true,
                }
              : undefined
          }
          filters={filters as any}
          search={search as any}
          isLoading={isLoading}
        />
      </div>
    </BaseLayout>
  );
}
