import {
  ActionMenu,
  Datagrid,
  DataGridTextCell,
  useFormatDate,
  useResourcesIcebergV6,
} from '@ovh-ux/manager-react-components';
import React from 'react';
import { toUnicode } from 'punycode';
import { ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import {
  FilterCategories,
  FilterTypeCategories,
} from '@ovh-ux/manager-core-api';
import { TDomain } from '@/alldoms/types/ongoing-operations';
import DatagridOngoingOperationState from '@/alldoms/components/DatagridColumns/DatagridOngoingOperationState';

export default function Domain() {
  const formatDate = useFormatDate();

  const columns = [
    {
      id: 'domain',
      cell: (props: TDomain) => (
        <DataGridTextCell>{toUnicode(props.domain)}</DataGridTextCell>
      ),
      label: 'Domaine',
      isSearchable: true,
    },
    {
      id: 'creationDate',
      cell: (props: TDomain) => (
        <DataGridTextCell>
          {formatDate({
            date: props.creationDate,
            format: 'Pp',
          })}
        </DataGridTextCell>
      ),
      label: 'Date de création',
    },
    {
      id: 'status',
      cell: (props: TDomain) => (
        <DatagridOngoingOperationState status={props.status} />
      ),
      label: 'Statut',
      type: FilterTypeCategories.String,
      comparator: FilterCategories.String,
      isFilterable: true,
    },
    {
      id: 'actions',
      cell: (props: TDomain) => (
        <ActionMenu
          isCompact
          variant={ODS_BUTTON_VARIANT.ghost}
          isDisabled={
            !props.canAccelerate && !props.canCancel && !props.canRelaunch
          }
          items={[
            {
              id: 1,
              label: "Modifier l'opération",
            },
          ]}
          id={`${props.id}`}
        />
      ),
      label: 'Actions',
    },
  ];

  const {
    flattenData,
    isError,
    error,
    filters,
    hasNextPage,
    fetchNextPage,
    sorting,
    totalCount,
    isLoading,
    setSorting,
    search,
  } = useResourcesIcebergV6<TDomain>({
    columns,
    route: '/me/task/domain',
    queryKey: ['me', 'task', 'domain'],
    pageSize: 5,
  });

  if (error) {
    return 'erreur';
  }

  return (
    <Datagrid
      columns={columns}
      items={flattenData || []}
      totalItems={totalCount}
      isLoading={isLoading}
      hasNextPage={hasNextPage && !isLoading}
      onFetchNextPage={fetchNextPage}
      sorting={sorting}
      onSortChange={setSorting}
      search={search}
      filters={filters}
    />
  );
}
