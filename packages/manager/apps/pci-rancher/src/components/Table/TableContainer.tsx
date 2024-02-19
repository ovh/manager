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
import { useMutation } from '@tanstack/react-query';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OsdsMessage, OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_MESSAGE_TYPE } from '@ovhcloud/ods-components';
import TableComponent from './Table';
import ProductStatusCell from './ProductStatusCell';
import ActionsCell from './ActionsCell';
import LinkService from './LinkService';
import DeleteModal from '../Modal/DeleteModal';
import { deleteRancherService, deleteRancherServiceQueryKey } from '../../api';
import { RancherService } from '@/api/api.type';
import { RancherDatagridWrapper } from './Table.type';
import DisplayCellText from './TextCell';
import './Table.scss';

export default function TableContainer({
  data,
  refetchRanchers,
}: Readonly<RancherDatagridWrapper>) {
  const { t } = useTranslation('pci-rancher/listing');
  const [sorting, setSorting] = useState<SortingState>([]);
  const { projectId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [isShowDeleteModal, setIsShowDeleteModal] = useState(false);
  const [selectedRancher, setSelectedRancher] = useState<RancherService>();
  const [
    deleteRancherResponse,
    setDeleteRancherResponse,
  ] = useState<ODS_MESSAGE_TYPE.error | null>(null);
  const { mutate: deleteRancher } = useMutation({
    mutationFn: () =>
      deleteRancherService({
        rancherId: selectedRancher?.id,
        projectId,
      }),
    mutationKey: deleteRancherServiceQueryKey(selectedRancher?.id),
    onSuccess: () => refetchRanchers(),
    onError: () => setDeleteRancherResponse(ODS_MESSAGE_TYPE.error),
  });

  const Actions = ({ row }: { row: Row<RancherService> }) => (
    <ActionsCell
      openModal={() => setIsShowDeleteModal(true)}
      setSelectedRancher={setSelectedRancher}
      row={row}
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
        accessorKey: 'currentState.usage.orchestratedVcpus',
        cell: DisplayCellText,
      },
      {
        id: 'status',
        header: t('status'),
        accessorKey: 'resourceStatus',
        cell: ProductStatusCell,
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
      {deleteRancherResponse && (
        <OsdsMessage type={deleteRancherResponse} className="my-4 p-3">
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.text}
            className="inline-block"
          >
            {t('deleteRancherError')}
          </OsdsText>
        </OsdsMessage>
      )}
      {data && columns && <TableComponent table={table} />}
      {isShowDeleteModal && (
        <DeleteModal
          toggleModal={setIsShowDeleteModal}
          onDeleteRancher={deleteRancher}
          selectedRancher={selectedRancher}
        />
      )}
    </>
  );
}
