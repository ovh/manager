import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import {
  DataGridTextCell,
  Datagrid,
  DatagridColumn,
  useDatagridSearchParams,
} from '@ovh-ux/manager-react-components';
import { convertToDuration } from '@/utils/commercial-catalog/utils';

import { SavingsPlanService } from '@/types/api.type';
import PlannedChangeStatusChip from '../PlannedChangeStatusChip/PlannedChangeStatusChip';
import StatusChip from '../StatusChip/StatusChip';
import ActionsCell from './ActionsCell';
import { SavingsPlanDatagridWrapper } from './Table.type';

type SortableKey = Pick<
  SavingsPlanService,
  'displayName' | 'endDate' | 'period' | 'periodEndDate'
>;

export const usePciUrl = () => {
  const { projectId } = useParams();

  const nav = useContext(ShellContext).shell.navigation;
  const [url, setUrl] = useState('');

  useEffect(() => {
    nav
      .getURL('public-cloud', `#/pci/projects/${projectId}`, {})
      .then((data) => {
        setUrl(data as string);
      });
  }, [projectId]);

  return url;
};

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
  const [searchParams] = useSearchParams();

  const paginatedData = useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    const { desc, id } = sorting;
    return (
      data
        ?.slice()
        ?.sort((a, b) => {
          const order = desc ? -1 : 1;
          if (id === 'size') {
            return order > 0 ? a.size - b.size : b.size - a.size;
          }
          if (a[id as keyof SortableKey]) {
            return (
              order *
              a[id as keyof SortableKey].localeCompare(
                b[id as keyof SortableKey],
              )
            );
          }
          return 1;
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
          <DataGridTextCell className="overflow-hidden text-ellipsis">
            {props.displayName || 'Savings Plan'}
          </DataGridTextCell>
        ),
      },
      {
        id: 'flavor',
        label: t('model'),
        accessorKey: 'flavor',
        cell: (props: SavingsPlanService) => (
          <DataGridTextCell>{props.flavor}</DataGridTextCell>
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
            {t('months', { count: convertToDuration(props.period) })}
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
            flavor={props.flavor}
            status={props.status}
            periodEndAction={props.periodEndAction}
            onClickRenew={() =>
              navigate({
                pathname: `./${props.id}/renew`,
                search: searchParams.toString(),
              })
            }
            onClickEditName={() => {
              navigate({
                pathname: `./${props.id}/edit-name`,
                search: searchParams.toString(),
              });
            }}
          />
        ),
      },
    ],
    [data, searchParams],
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
