import {
  DataGridTextCell,
  Datagrid,
  DatagridColumn,
  useDatagridSearchParams,
} from '@ovhcloud/manager-components';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { SavingsPlanService } from '@/types/api.type';
import PlannedChangeStatusChip from '../PlannedChangeStatusChip/PlannedChangeStatusChip';
import StatusChip from '../StatusChip/StatusChip';
import ActionsCell from './ActionsCell';
import { SavingsPlanDatagridWrapper } from './Table.type';
import { convertToDuration } from '@/utils/commercial-catalog/utils';

type SortableKey = Pick<
  SavingsPlanService,
  'displayName' | 'endDate' | 'period' | 'periodEndDate'
>;

export default function TableContainer({
  data,
}: Readonly<SavingsPlanDatagridWrapper>) {
  const { t } = useTranslation('listing');
  const navigate = useNavigate();

  const {
    pagination,
    setPagination,
    sorting,
    setSorting,
  } = useDatagridSearchParams();

  const paginatedData = useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    const { desc, id } = sorting;
    return (
      data
        ?.sort((a, b) => {
          const order = desc ? -1 : 1;
          switch (id) {
            case 'size':
              return order > 0 ? a.size - b.size : b.size - a.size;
            default: {
              if (a[id as keyof SortableKey]) {
                return (
                  order *
                  a[id as keyof SortableKey].localeCompare(
                    b[id as keyof SortableKey],
                  )
                );
              }
              return 1;
            }
          }
        })
        .slice(start, end) || []
    );
  }, [data, pagination, sorting]);

  const columns: DatagridColumn<SavingsPlanService>[] = useMemo(
    () => [
      {
        id: 'displayName',
        label: t('name'),
        cell: (props: SavingsPlanService) => (
          <DataGridTextCell>
            {props.displayName || 'Savings Plan'}
          </DataGridTextCell>
        ),
      },
      {
        id: 'model',
        label: t('model'),
        accessorKey: 'model',
        cell: (props: SavingsPlanService) => (
          <DataGridTextCell>{props.model}</DataGridTextCell>
        ),
      },
      {
        id: 'size',
        label: t('quantity'),
        cell: (props: SavingsPlanService) => (
          <DataGridTextCell>{props.size}</DataGridTextCell>
        ),
      },
      {
        id: 'period',
        label: t('duration'),
        cell: (props: SavingsPlanService) => (
          <DataGridTextCell>
            {t('months', { monthValue: convertToDuration(props.period) })}
          </DataGridTextCell>
        ),
      },
      {
        id: 'periodEndAction',
        label: t('renew'),
        accessorKey: 'periodEndAction',
        cell: (props: SavingsPlanService) => (
          <PlannedChangeStatusChip label={props?.periodEndAction as string} />
        ),
      },
      {
        id: 'startDate',
        label: t('startDate'),
        accessorFn: (row: SavingsPlanService) => row.periodStartDate,
        cell: (props: SavingsPlanService) => (
          <DataGridTextCell>{props.periodStartDate}</DataGridTextCell>
        ),
      },
      {
        id: 'endDate',
        label: t('endDate'),
        accessorFn: (row: SavingsPlanService) => row.periodEndDate,
        cell: (props: SavingsPlanService) => (
          <DataGridTextCell>{props.periodEndDate}</DataGridTextCell>
        ),
      },
      {
        id: 'status',
        label: t('status'),
        accessorKey: 'status',
        cell: (props: SavingsPlanService) => (
          <StatusChip label={props?.status as string} />
        ),
      },
      {
        id: 'actions',
        label: t('actions'),
        accessorKey: 'actions',
        cell: (props: SavingsPlanService) => (
          <ActionsCell
            id={props.id}
            status={props.status}
            periodEndAction={props.periodEndAction}
            onClickRenew={() => navigate(`./${props.id}/renew`)}
            onClickEditName={() => navigate(`./${props.id}/edit-name`)}
          />
        ),
      },
    ],
    [data],
  );

  return (
    <>
      {paginatedData && columns && (
        <Datagrid
          items={paginatedData}
          columns={columns}
          totalItems={data.length}
          pagination={pagination}
          onPaginationChange={setPagination}
          sorting={sorting}
          onSortChange={setSorting}
        />
      )}
    </>
  );
}
