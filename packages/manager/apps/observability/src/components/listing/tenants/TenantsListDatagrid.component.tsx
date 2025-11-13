import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { VisibilityState } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { FilterComparator, FilterTypeCategories, applyFilters } from '@ovh-ux/manager-core-api';
import {
  Datagrid,
  DatagridColumn,
  useColumnFilters,
  useDateFnsLocale,
  useNotifications,
} from '@ovh-ux/muk';

import DatagridCellEnpoint from '@/components/listing/common/datagrid-cells/datagrid-cell-endpoint/DataGridCellEndpoint.component';
import DatagridCellLink from '@/components/listing/common/datagrid-cells/datagrid-cell-link/DataGridCellLink.component';
import DatagridTenantCellTags from '@/components/listing/common/datagrid-cells/datagrid-cell-tags/DataGridCellTags.component';
import { TenantsListDatagridProps } from '@/components/listing/tenants/TenantsListDatagrid.props';
import TenantsListActions from '@/components/listing/tenants/actions/TenantsListActions.component';
import TenantsListTopbar from '@/components/listing/tenants/top-bar/TenantsListTopbar.component';
import { TenantListing } from '@/types/tenants.type';
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
        accessorKey: 'name',
        isSearchable: true,
        isSortable: true,
        isFilterable: true,
        enableHiding: false,
        cell: (context) => {
          const { id, name } = context.row.original;
          return <DatagridCellLink id={id} label={name} path={id} />;
        },
        header: t(`${NAMESPACES.DASHBOARD}:name`),
        type: FilterTypeCategories.String,
      },
      {
        id: 'endpoint',
        isSearchable: true,
        isSortable: true,
        isFilterable: true,
        enableHiding: true,
        cell: (context) => {
          const { infrastructure } = context.row.original;
          return <DatagridCellEnpoint infrastructure={infrastructure} />;
        },
        header: t('tenants:listing.endpoint_cell'),
        type: FilterTypeCategories.String,
      },
      {
        id: 'retention',
        isSearchable: true,
        isSortable: true,
        isFilterable: true,
        enableHiding: true,
        accessorKey: 'retention',
        header: t('tenants:listing.retention_cell'),
        type: FilterTypeCategories.String,
      },
      {
        id: 'active-metrics',
        isSearchable: true,
        isSortable: true,
        isFilterable: true,
        enableHiding: true,
        accessorKey: 'numberOfSeries',
        header: t('tenants:listing.active_metrics_cell'),
        type: FilterTypeCategories.Numeric,
      },
      {
        id: 'tags',
        isSearchable: true,
        isSortable: false,
        isFilterable: true,
        enableHiding: true,
        type: FilterTypeCategories.String,
        header: t('tenants:listing.tags_cell'),
        cell: (context) => {
          const { tagsArray: tags } = context.row.original;
          return <DatagridTenantCellTags tags={tags} />;
        },
        size: 100,
      },
      {
        id: 'actions',
        isSearchable: false,
        isSortable: false,
        isFilterable: false,
        enableHiding: true,
        accessorKey: 'id',
        header: '',
        cell: ({ getValue }) => <TenantsListActions tenantId={getValue<string>()} />,
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
      add({
        key: 'name',
        label: t(`${NAMESPACES.DASHBOARD}:name`),
        value: newSearch,
        comparator: FilterComparator.Includes,
      });
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
        topbar={topbar}
        columns={columns}
        columnVisibility={columnVisibilityProps}
        data={filteredTenants}
        totalCount={tenantsList.length}
        filters={filtersProps}
        search={searchProps}
        isLoading={isLoading}
      />
    </React.Suspense>
  );
}
