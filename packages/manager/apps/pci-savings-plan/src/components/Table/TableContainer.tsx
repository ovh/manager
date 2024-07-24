import {
  DataGridTextCell,
  Datagrid,
  DatagridColumn,
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

export default function TableContainer({
  data,
}: Readonly<SavingsPlanDatagridWrapper>) {
  const { t } = useTranslation('listing');
  const navigate = useNavigate();

  const columns: DatagridColumn<SavingsPlanService>[] = useMemo(
    () => [
      {
        id: 'name',
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
        id: 'quantity',
        label: t('quantity'),
        cell: (props: SavingsPlanService) => (
          <DataGridTextCell>{props.size}</DataGridTextCell>
        ),
      },
      {
        id: 'duration',
        label: t('duration'),
        cell: (props: SavingsPlanService) => (
          <DataGridTextCell>
            {t('months', { monthValue: convertToDuration(props.period) })}
          </DataGridTextCell>
        ),
      },
      {
        id: 'renew',
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
            onClickManage={() => navigate(`./${props.id}/renew`)}
            onClickDelete={() => navigate(`./${props.id}/delete`)}
          />
        ),
      },
    ],
    [data],
  );

  return (
    <>
      {data && columns && (
        <Datagrid items={data} columns={columns} totalItems={data.length} />
      )}
    </>
  );
}
