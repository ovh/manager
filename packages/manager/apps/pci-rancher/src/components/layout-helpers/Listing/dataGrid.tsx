import { OdsDatagridColumn } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  OsdsLink,
  OsdsDatagrid,
  OsdsMessage,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useHref } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

import { RancherService } from '@/api/api.type';
import DeleteModal from '@/components/Modal/DeleteModal';
import ActionsCell from '../OdsCell/ActionsCell';
import { ProductStatusCell } from '../OdsCell/ProductStatusCell';
import ReactFormatter from './OdsFormatter';
import { deleteRancherService, deleteRancherServiceQueryKey } from '@/api';

interface LinkServiceInterface {
  rowData?: RancherService;
  cellData?: string;
  href?: string;
}

interface CpuDisplayInterface {
  cellData?: string;
}

interface DatagridWrapperInterface {
  data: RancherService[];
}

function LinkService({ cellData, rowData, href }: LinkServiceInterface) {
  return (
    <OsdsLink
      color={ODS_THEME_COLOR_INTENT.primary}
      href={`${href}/${rowData.id}`}
    >
      {cellData}
    </OsdsLink>
  );
}

function CpuDisplay({ cellData }: CpuDisplayInterface) {
  return (
    <OsdsText color={ODS_THEME_COLOR_INTENT.text}>{cellData ?? '-'}</OsdsText>
  );
}

export default function DatagridWrapper({ data }: DatagridWrapperInterface) {
  const { t } = useTranslation('pci-rancher/listing');
  const { projectId } = useParams();

  const navigate = useNavigate();
  const [showDeleteModal, toggleDeleteModal] = useState(false);
  const [selectedRancher, setSelectedRancher] = useState<RancherService>();

  const { mutate: deleteRancher, isError } = useMutation({
    mutationFn: () =>
      deleteRancherService({
        rancherId: selectedRancher?.id,
        projectId,
      }),
    mutationKey: deleteRancherServiceQueryKey(selectedRancher?.id),
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
        <OsdsMessage color={ODS_THEME_COLOR_INTENT.error}>
          Une erreur est survenue lors de la suppression de votre service
          Rancher. Merci de réessayer.
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
