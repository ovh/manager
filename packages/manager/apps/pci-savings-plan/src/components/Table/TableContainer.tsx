import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useReactTable,
  ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  Row,
} from '@tanstack/react-table';
import { ODS_MESSAGE_TYPE } from '@ovhcloud/ods-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OsdsMessage, OsdsText } from '@ovhcloud/ods-components/react';
import TableComponent from './Table';
import ActionsCell from './ActionsCell';
import LinkService from './LinkService';
import { SavingsPlanService } from '@/data/api/api.type';
import { SavingsPlanDatagridWrapper } from './Table.type';
import DisplayCellText from './TextCell';
import './Table.scss';
import StatusChip from '../StatusChip/StatusChip';
import PlannedChangeStatusChip from '../PlannedChangeStatusChip/PlannedChangeStatusChip';

export default function TableContainer({
  data,
}: Readonly<SavingsPlanDatagridWrapper>) {
  const { t } = useTranslation('listing');
  const [sorting, setSorting] = useState<SortingState>([]);
  const navigate = useNavigate();
  const location = useLocation();

  const Actions = ({ row }: { row: Row<SavingsPlanService> }) => (
    <ActionsCell
      row={row}
      onClickDelete={() =>
        navigate(`${location.pathname}/${row.original.id}/delete`)
      }
      onClickManage={(path: string) => navigate(`${location.pathname}/${path}`)}
    />
  );

  const columns: ColumnDef<SavingsPlanService>[] = useMemo(
    () => [
      {
        id: 'name',
        header: t('name'),
        accessorKey: 'name',
        accessorFn: (row) => row.displayName,
        cell: LinkService,
      },
      {
        id: 'model',
        header: t('model'),
        accessorKey: 'model',
        accessorFn: (row) => row.model,
        cell: DisplayCellText,
      },
      {
        id: 'quantity',
        header: t('quantity'),
        accessorKey: 'size',
        cell: DisplayCellText,
      },
      {
        id: 'duration',
        header: t('duration'),
        accessorFn: (row) => row.period,
        cell: DisplayCellText,
      },
      {
        id: 'renew',
        header: t('renew'),        
        accessorKey: 'periodEndAction',
        cell: (row) => <PlannedChangeStatusChip label={row.getValue() as string} />,
      },
      {
        id: 'startDate',
        header: t('startDate'),
        accessorFn: (row) => row.periodStartDate,
        cell: DisplayCellText,
      },
      {
        id: 'endDate',
        header: t('endDate'),
        accessorFn: (row) => row.periodEndDate,
        cell: DisplayCellText,
      },
      {
        id: 'status',
        header: t('status'),
        accessorKey: 'status',
        cell: (row) => <StatusChip label={row.getValue() as string} />,
      },
      {
        id: 'actions',
        header: t('actions'),
        accessorKey: 'actions',
        cell: Actions,
      },
    ],
    [data],
  );

  const table = useReactTable<SavingsPlanService>({
    columns,
    data,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <>
      {/* { (
        <OsdsMessage type={ODS_MESSAGE_TYPE.error} className="my-4 p-3">
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.text}
            className="inline-block"
          >
            {t('deleteSavingsPlanError')}
          </OsdsText>
        </OsdsMessage>
      )} */}
      {data && columns && <TableComponent table={table} />}
    </>
  );
}
