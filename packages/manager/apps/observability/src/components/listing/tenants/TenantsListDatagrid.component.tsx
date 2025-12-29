import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { VisibilityState } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

import { TABLE_SIZE } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  FilterCategories,
  FilterComparator,
  FilterTypeCategories,
  applyFilters,
} from '@ovh-ux/manager-core-api';
import {
  Datagrid,
  DatagridColumn,
  TagsList,
  useColumnFilters,
  useDateFnsLocale,
  useNotifications,
} from '@ovh-ux/muk';

import DatagridCellEnpoint from '@/components/listing/common/datagrid-cells/datagrid-cell-endpoint/DataGridCellEndpoint.component';
import DatagridCellLink from '@/components/listing/common/datagrid-cells/datagrid-cell-link/DataGridCellLink.component';
import { TenantsListDatagridProps } from '@/components/listing/tenants/TenantsListDatagrid.props';
import TenantsListActions from '@/components/listing/tenants/actions/TenantsListActions.component';
import TenantsListTopbar from '@/components/listing/tenants/top-bar/TenantsListTopbar.component';
import TenantStatus from '@/components/metrics/tenant-status/TenantStatus.component';
import { TenantListing } from '@/types/tenants.type';
import { RESOURCE_TYPES } from '@/utils/iam.constants';
import { mapTenantsToListing } from '@/utils/tenants.utils';

export default function TenantsListDatagrid({
  tenantsList,
  isLoading,
  error,
  isError,
}: TenantsListDatagridProps) {
  const [searchInput, setSearchInput] = useState<string>('');
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    name: true,
    endpoint: true,
    retention: true,
    'active-metrics': true,
    tags: true,
    actions: true,
  });
  const { t } = useTranslation(['tenants', NAMESPACES.DASHBOARD, NAMESPACES.ERROR]);
  const { addError } = useNotifications();
  const dateFnsLocale = useDateFnsLocale();

  const columns: DatagridColumn<TenantListing>[] = useMemo(
    () => [
      {
        id: 'name',
        header: t(`${NAMESPACES.DASHBOARD}:name`),
        label: t(`${NAMESPACES.DASHBOARD}:name`),
        accessorFn: (row: TenantListing) => row,
        cell: ({ getValue }) => {
          const { id, name } = getValue() as TenantListing;
          return <DatagridCellLink id={id} label={name} />;
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
        accessorFn: (row: TenantListing) => row.id,
        cell: ({ getValue }) => <TenantsListActions tenantId={getValue<string>()} />,
        isSearchable: false,
        isFilterable: false,
        size: 40,
      },
    ],
    [t],
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

  const { filters, addFilter: add, removeFilter: remove } = useColumnFilters();

  const listingTenants = useMemo(() => {
    if (!tenantsList) return [];
    return mapTenantsToListing(tenantsList, dateFnsLocale);
  }, [tenantsList, dateFnsLocale]);

  const filteredTenants = useMemo(() => {
    return applyFilters(listingTenants, filters);
  }, [listingTenants, filters]);

  const topbar = useMemo(() => <TenantsListTopbar />, []);

  const columnVisibilityProps = useMemo(
    () => ({ columnVisibility, setColumnVisibility }),
    [columnVisibility, setColumnVisibility],
  );

  const filtersProps = useMemo(() => ({ filters, add, remove }), [filters, add, remove]);

  const onSearch = useCallback(
    (newSearch: string) => {
      if (newSearch && newSearch.length) {
        add({
          key: 'search',
          label: t(`tenants:listing.filter_search_key`),
          value: newSearch,
          comparator: FilterComparator.Includes,
        });
        setSearchInput('');
      }
    },
    [add, t],
  );

  const searchProps = useMemo(
    () => ({
      searchInput,
      setSearchInput,
      onSearch,
    }),
    [searchInput, setSearchInput, onSearch],
  );

  if (!tenantsList) {
    return null;
  }

  return (
    <React.Suspense>
      <Datagrid
        key={filteredTenants.length}
        topbar={topbar}
        columns={columns}
        columnVisibility={columnVisibilityProps}
        data={filteredTenants}
        totalCount={filteredTenants.length}
        filters={filtersProps}
        search={searchProps}
        containerHeight={725} //TOFIX: waiting muk fixes
        size={TABLE_SIZE.lg}
        contentAlignLeft={true}
        isLoading={isLoading}
        resourceType={RESOURCE_TYPES.TENANT}
      />
    </React.Suspense>
  );
}
