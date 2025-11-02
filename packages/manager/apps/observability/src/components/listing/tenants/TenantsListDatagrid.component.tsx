import React, { useEffect, useMemo, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { FilterComparator, FilterTypeCategories, applyFilters } from '@ovh-ux/manager-core-api';
import {
  DataGridTextCell,
  Datagrid,
  DatagridColumn,
  useColumnFilters,
  useNotifications,
} from '@ovh-ux/manager-react-components';

import { Infrastructure } from '@/types/infrastructures.type';
import { TIdentifier } from '@/types/observability.type';
import { Tenant } from '@/types/tenants.type';

import DatagridCellEnpoint from '../common/datagrid-cells/datagrid-cell-endpoint/DataGridCellEndpoint.component';
import DatagridCellLink from '../common/datagrid-cells/datagrid-cell-link/DataGridCellLink.component';
import DatagridTenantCellTags from '../common/datagrid-cells/datagrid-cell-tags/DataGridCellTags.component';
import { TenantsListDatagridProps } from './TenantsListDatagrid.props';
import TenantsListActions from './actions/TenantsListActions.component';
import TenantsListTopbar from './top-bar/TenantsListTopbar.component';

type MappedTenant = {
  name: string;
  endpoint: string | undefined;
  infrastructure: Infrastructure | undefined;
  retention: string | undefined;
  numberOfSeries: number | undefined;
  tags: string;
  tagsArray: string[];
} & TIdentifier;

export default function TenantsListDatagrid({
  tenantsList,
  isLoading,
  error,
  isError,
}: TenantsListDatagridProps) {
  const [searchInput, setSearchInput] = useState('');
  const { t } = useTranslation(['tenants', NAMESPACES.DASHBOARD, NAMESPACES.ERROR]);
  const { addError } = useNotifications();

  const tenantsMapper = (tenants: Tenant[]): MappedTenant[] => {
    const result: MappedTenant[] = tenants.map(({ id, currentState }) => {
      const { title, limits, infrastructure, tags } = currentState;
      return {
        id,
        name: title,
        infrastructure: infrastructure,
        endpoint: infrastructure?.currentState.entryPoint,
        retention: limits?.retention?.duration,
        numberOfSeries: limits?.numberOfSeries.current,
        tags: tags?.join(';') ?? '',
        tagsArray: tags ?? [],
      };
    });
    return result;
  };

  const columns: DatagridColumn<MappedTenant>[] = [
    {
      id: 'name',
      isSearchable: true,
      isSortable: true,
      isFilterable: true,
      enableHiding: false,
      cell: ({ id, name }: MappedTenant) => <DatagridCellLink id={id} label={name} path={id} />,
      label: t(`${NAMESPACES.DASHBOARD}:name`),
      type: FilterTypeCategories.String,
    },
    {
      id: 'endpoint',
      isSearchable: true,
      isSortable: true,
      isFilterable: true,
      enableHiding: true,
      cell: ({ infrastructure }: MappedTenant) => (
        <DatagridCellEnpoint infrastructure={infrastructure} />
      ),
      label: t('tenants:listing.endpoint_cell'),
      type: FilterTypeCategories.String,
    },
    {
      id: 'retention',
      isSearchable: true,
      isSortable: true,
      isFilterable: true,
      enableHiding: true,
      label: t('tenants:listing.retention_cell'),
      cell: ({ retention }: MappedTenant) => <DataGridTextCell>{retention}</DataGridTextCell>,
      type: FilterTypeCategories.String,
    },
    {
      id: 'active-metrics',
      isSearchable: true,
      isSortable: true,
      isFilterable: true,
      enableHiding: true,
      label: t('tenants:listing.active_metrics_cell'),
      cell: ({ numberOfSeries }: MappedTenant) => (
        <DataGridTextCell>{numberOfSeries}</DataGridTextCell>
      ),
      type: FilterTypeCategories.Numeric,
    },
    {
      id: 'tags',
      isSearchable: true,
      isSortable: true,
      isFilterable: true,
      enableHiding: true,
      type: FilterTypeCategories.String,
      label: t('tenants:listing.tags_cell'),
      cell: ({ tagsArray: tags }: MappedTenant) => <DatagridTenantCellTags tags={tags} />,
    },
    {
      id: 'actions',
      isSearchable: false,
      isSortable: false,
      isFilterable: false,
      enableHiding: true,
      label: '',
      cell: (tenant: MappedTenant) => {
        return TenantsListActions({
          tenantId: tenant.id,
        });
      },
    },
  ];

  useEffect(() => {
    if (isError) {
      addError(
        t(`${NAMESPACES.ERROR}:error_message`, {
          message: error?.message,
        }),
      );
    }
  }, [addError, error, isError, t]);

  const { filters, addFilter, removeFilter } = useColumnFilters();

  const searchedTenants = useMemo(() => {
    if (!tenantsList) return [];
    const s = searchInput.toLocaleLowerCase();
    const mappedTenants = tenantsMapper(tenantsList);
    return mappedTenants.filter((t: MappedTenant) => {
      return t.name.toLowerCase().includes(s) || t.endpoint?.toLowerCase().includes(s);
    });
  }, [tenantsList, searchInput]);

  if (!tenantsList) {
    return null;
  }

  return (
    <React.Suspense>
      <Datagrid
        topbar={<TenantsListTopbar />}
        columns={columns}
        items={applyFilters(searchedTenants, filters)}
        totalItems={tenantsList.length}
        filters={{ filters, add: addFilter, remove: removeFilter }}
        search={{
          searchInput,
          setSearchInput,
          onSearch: (newSearch) => {
            addFilter({
              key: 'name',
              label: t(`${NAMESPACES.DASHBOARD}:name`),
              value: newSearch,
              comparator: FilterComparator.Includes,
            });
          },
        }}
        isLoading={isLoading}
      />
    </React.Suspense>
  );
}
