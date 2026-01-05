import { useEffect, useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { FilterCategories, FilterTypeCategories } from '@ovh-ux/manager-core-api';
import { DatagridColumn, TagsList, useDateFnsLocale, useNotifications } from '@ovh-ux/muk';

import DatagridCellEnpoint from '@/components/listing/common/datagrid/datagrid-cell-endpoint/DataGridCellEndpoint.component';
import DatagridCellLink from '@/components/listing/common/datagrid/datagrid-cell-link/DataGridCellLink.component';
import FilteredDatagrid from '@/components/listing/common/datagrid/filtered-datagrid/FilteredDatagrid.component';
import { TenantsListDatagridProps } from '@/components/listing/tenants/TenantsListDatagrid.props';
import TenantsListActions from '@/components/listing/tenants/actions/TenantsListActions.component';
import TenantsListTopbar from '@/components/listing/tenants/top-bar/TenantsListTopbar.component';
import TenantStatus from '@/components/metrics/tenant-status/TenantStatus.component';
import { useObservabilityServiceContext } from '@/contexts/ObservabilityService.context';
import { TenantListing } from '@/types/tenants.type';
import { RESOURCE_TYPES } from '@/utils/iam.constants';
import { mapTenantsToListing } from '@/utils/tenants.utils';

export default function TenantsListDatagrid({
  tenantsList,
  isLoading,
  error,
  isError,
}: TenantsListDatagridProps) {
  const { t } = useTranslation(['tenants', NAMESPACES.DASHBOARD, NAMESPACES.ERROR]);
  const { addError } = useNotifications();
  const dateFnsLocale = useDateFnsLocale();
  const { selectedService } = useObservabilityServiceContext();
  const resourceName = selectedService?.id ?? '';
  const columns: DatagridColumn<TenantListing>[] = useMemo(
    () => [
      {
        id: 'name',
        header: t(`${NAMESPACES.DASHBOARD}:name`),
        label: t(`${NAMESPACES.DASHBOARD}:name`),
        accessorFn: (row: TenantListing) => row,
        cell: ({ getValue }) => {
          const { id, name } = getValue() as TenantListing;
          return <DatagridCellLink tenantId={id} label={name} resourceName={resourceName} />;
        },
        comparator: FilterCategories.String,
        type: FilterTypeCategories.String,
        isSearchable: true,
        isFilterable: true,
        size: 200,
      },
      {
        id: 'endpoint',
        header: t(`tenants:listing.endpoint_cell`),
        label: t(`tenants:listing.endpoint_cell`),
        accessorFn: (row: TenantListing) => row,
        cell: ({ getValue }) => {
          const { infrastructure } = getValue() as TenantListing;
          return <DatagridCellEnpoint infrastructure={infrastructure} />;
        },
        comparator: FilterCategories.String,
        type: FilterTypeCategories.String,
        isSearchable: true,
        isFilterable: true,
        size: 200,
      },
      {
        id: 'status',
        header: t(`tenants:status.title`),
        label: t(`tenants:status.title`),
        accessorFn: (row: TenantListing) => row,
        cell: ({ getValue }) => {
          const { resourceStatus } = getValue() as TenantListing;
          return <TenantStatus status={resourceStatus} />;
        },
        comparator: FilterCategories.String,
        type: FilterTypeCategories.String,
        isSearchable: true,
        isFilterable: true,
        size: 120,
      },
      {
        id: 'retention',
        header: t('tenants:listing.retention_cell'),
        label: t('tenants:listing.retention_cell'),
        accessorKey: 'retention',
        comparator: FilterCategories.String,
        type: FilterTypeCategories.String,
        isSearchable: true,
        isFilterable: true,
        size: 100,
      },
      {
        id: 'active-metrics',
        header: t('tenants:listing.active_metrics_cell'),
        label: t('tenants:listing.active_metrics_cell'),
        accessorKey: 'numberOfSeries',
        comparator: FilterCategories.Numeric,
        type: FilterTypeCategories.Numeric,
        isSearchable: true,
        isFilterable: true,
        size: 100,
      },
      {
        id: 'tags',
        header: t('tenants:listing.tags_cell'),
        label: t('tenants:listing.tags_cell'),
        accessorFn: (tenant: TenantListing) => tenant,
        cell: ({ getValue }) => {
          const { name, tags } = getValue<TenantListing>();
          return <TagsList tags={tags} modalHeading={name} maxLines={1} />;
        },
        comparator: FilterCategories.Tags,
        type: FilterTypeCategories.Tags,
        isSearchable: true,
        isFilterable: true,
        size: 200,
      },
      {
        id: 'actions',
        header: '',
        accessorKey: 'id',
        cell: ({ getValue }) => (
          <TenantsListActions tenantId={getValue<string>()} resourceName={resourceName} />
        ),
        isSearchable: false,
        isFilterable: false,
        size: 40,
      },
    ],
    [t, resourceName],
  );

  useEffect(() => {
    if (isError) {
      addError(
        t(`${NAMESPACES.ERROR}:error_message`, {
          message: error?.message,
        }),
      );
    }
  }, [addError, error, isError, t]);

  const listingTenants = useMemo(() => {
    if (!tenantsList) return [];
    return mapTenantsToListing(tenantsList, dateFnsLocale);
  }, [tenantsList, dateFnsLocale]);

  const topbar = useMemo(() => <TenantsListTopbar />, []);

  if (!tenantsList) {
    return null;
  }

  return (
    <FilteredDatagrid<TenantListing>
      topbar={topbar}
      columns={columns}
      data={listingTenants}
      isLoading={isLoading}
      resourceType={RESOURCE_TYPES.TENANT}
      searchFilterLabel={t('tenants:listing.filter_search_key')}
    />
  );
}
