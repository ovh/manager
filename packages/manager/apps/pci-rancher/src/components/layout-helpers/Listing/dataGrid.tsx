import { ODS_MESSAGE_TYPE, OdsDatagridColumn } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  OsdsLink,
  OsdsDatagrid,
  OsdsMessage,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import React, { useState } from 'react';
import { TFunction, useTranslation } from 'react-i18next';
import { useParams, useHref } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

import DeleteModal from '../../../components/Modal/DeleteModal';
import ActionsCell from '../OdsCell/ActionsCell';
import {
  DataGridCellProps,
  ProductStatusCell,
} from '../OdsCell/ProductStatusCell';
import ReactFormatter from './OdsFormatter';
import {
  deleteRancherService,
  deleteRancherServiceQueryKey,
} from '../../../api';
import { RessourceStatus, RancherService } from '../../../api/api.type';

interface LinkServiceInterface {
  rowData?: RancherService;
  cellData?: string;
  href?: string;
}

interface DatagridWrapperInterface {
  data: RancherService[];
}

function LinkService({ cellData, rowData, href }: LinkServiceInterface) {
  return (
    <OsdsLink
      color={ODS_THEME_COLOR_INTENT.primary}
      href={`${href}/${rowData?.id}`}
    >
      {cellData}
    </OsdsLink>
  );
}

function VersionDisplay({
  cellData,
  t,
}: DataGridCellProps<RessourceStatus, RancherService> & { t: TFunction }) {
  return (
    <OsdsText color={ODS_THEME_COLOR_INTENT.text}>
      {cellData ? t(cellData) : '-'}
    </OsdsText>
  );
}

function CpuDisplay({
  cellData,
}: DataGridCellProps<RessourceStatus, RancherService>) {
  return (
    <OsdsText color={ODS_THEME_COLOR_INTENT.text}>{cellData ?? '-'}</OsdsText>
  );
}

export default function DatagridWrapper({ data }: DatagridWrapperInterface) {
  const { t } = useTranslation('pci-rancher/listing');
  const { projectId } = useParams();
  const [showDeleteModal, toggleDeleteModal] = useState(false);
  const [selectedRancher, setSelectedRancher] = useState<RancherService>();
  const [
    deleteRancherResponse,
    setDeleteRancherResponse,
  ] = useState<ODS_MESSAGE_TYPE | null>(null);

  const { mutate: deleteRancher, isError } = useMutation({
    mutationFn: () =>
      deleteRancherService({
        rancherId: selectedRancher?.id,
        projectId,
      }),
    mutationKey: deleteRancherServiceQueryKey(selectedRancher?.id),
    onSuccess: () => {
      setDeleteRancherResponse(ODS_MESSAGE_TYPE.success);
    },
    onError: () => {
      setDeleteRancherResponse(ODS_MESSAGE_TYPE.error);
    },
  });

  const onDeleteRancher = () => deleteRancher();

  const hrefDashboard = useHref('');
  const columns: OdsDatagridColumn[] = [
    {
      title: t('name'),
      field: 'currentState.name',
      formatter: ReactFormatter(<LinkService href={hrefDashboard} />), // TODO: Find way to useHref cause hook not work in datagrid
    },
    {
      title: t('serviceLevel'),
      field: 'targetSpec.plan',
    },
    {
      title: t('rancherVersion'),
      field: 'targetSpec.version',
      formatter: ReactFormatter(<VersionDisplay t={t} />),
    },
    {
      title: t('numberOfCpu'),
      field: 'currentState.usage.orchestratedVcpus',
      formatter: ReactFormatter(<CpuDisplay />),
    },
    {
      title: t('status'),
      field: 'resourceStatus',
      formatter: ReactFormatter(<ProductStatusCell t={t} />),
    },
    {
      title: t('actions'),
      field: '',
      formatter: ReactFormatter(
        <ActionsCell
          href={hrefDashboard}
          openModal={() => toggleDeleteModal(true)}
          isLoading={false}
          setSelectedRancher={setSelectedRancher}
        />,
      ),
    },
  ];

  return (
    <>
      {isError && (
        <OsdsMessage
          color={ODS_THEME_COLOR_INTENT.error}
          type={ODS_MESSAGE_TYPE.error}
        >
          Une erreur est survenue lors de la suppression de votre service
          Rancher. Merci de réessayer.
        </OsdsMessage>
      )}
      {deleteRancherResponse && (
        <OsdsMessage type={deleteRancherResponse} className="my-4 p-3">
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.text}
            className="inline-block"
          >
            {deleteRancherResponse === ODS_MESSAGE_TYPE.info
              ? t('deleteRancherSuccess')
              : t('deleteRancherError')}
          </OsdsText>
        </OsdsMessage>
      )}
      {columns && data && data.length > 0 && (
        <OsdsDatagrid
          hasHideableColumns={undefined}
          height={500}
          columns={columns}
          rows={data as any}
          noResultLabel={t('emptyDataGridMessage')}
        />
      )}
      {showDeleteModal && (
        <DeleteModal
          toggleModal={toggleDeleteModal}
          onDeleteRancher={onDeleteRancher}
          selectedRancher={selectedRancher}
        />
      )}
    </>
  );
}
