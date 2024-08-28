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
import { useMutationState } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OsdsMessage, OsdsText } from '@ovhcloud/ods-components/react';
import TableComponent from './Table';
import ActionsCell from './ActionsCell';
import LinkService from './LinkService';
import DataGridCell from './DataGridCell';
import { RancherService } from '@/api/api.type';
import { RancherDatagridWrapper } from './Table.type';
import DisplayCellText from './TextCell';
import './Table.scss';
import { deleteRancherServiceQueryKey } from '@/api';
import StatusChip from '../StatusChip/StatusChip';

export default function TableContainer({
  data,
}: Readonly<RancherDatagridWrapper>) {
  const { t } = useTranslation('pci-rancher/listing');
  const [sorting, setSorting] = useState<SortingState>([]);
  const state = useMutationState({
    filters: {
      mutationKey: deleteRancherServiceQueryKey('').slice(0, 1),
      status: 'error',
    },
  });
  const navigate = useNavigate();
  const location = useLocation();

  const Actions = ({ row }: { row: Row<RancherService> }) => (
    <ActionsCell
      row={row}
      onClickDelete={() =>
        navigate(`${location.pathname}/${row.original.id}/delete`)
      }
      onClickManage={(path: string) => navigate(`${location.pathname}/${path}`)}
    />
  );

  const columns: ColumnDef<RancherService>[] = useMemo(
    () => [
      {
        id: 'name',
        header: t('name'),
        accessorKey: 'currentState.name',
        cell: LinkService,
      },
      {
        id: 'id',
        header: 'ID',
        accessorKey: 'id',
        cell: DataGridCell,
      },
      {
        id: 'serviceLevel',
        header: t('serviceLevel'),
        accessorKey: 'currentState.plan',
        cell: DisplayCellText,
      },
      {
        id: 'rancherVersion',
        header: t('rancherVersion'),
        accessorKey: 'currentState.version',
        cell: DisplayCellText,
      },
      {
        id: 'numberOfCpu',
        header: t('numberOfCpu'),
        accessorFn: (row) => row.currentState.usage?.orchestratedVcpus,
        cell: DisplayCellText,
      },
      {
        id: 'status',
        header: t('status'),
        accessorKey: 'resourceStatus',
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

  const table = useReactTable<RancherService>({
    columns,
    data,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <>
      {!!state.length && (
        <OsdsMessage type={ODS_MESSAGE_TYPE.error} className="my-4 p-3">
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.text}
            className="inline-block"
          >
            {t('deleteRancherError')}
          </OsdsText>
        </OsdsMessage>
      )}
      {data && columns && <TableComponent table={table} />}
    </>
  );
}
