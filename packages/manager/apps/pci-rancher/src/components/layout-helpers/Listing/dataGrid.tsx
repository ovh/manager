import { OdsDatagridColumn } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  OsdsLink,
  OsdsDatagrid,
  OsdsMessage,
} from '@ovhcloud/ods-components/react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

import { RancherService } from '@/api/api.type';
import DeleteModal from '@/components/Modal/DeleteModal';
import ActionsCell from '../OdsCell/ActionsCell';
import { ProductStatusCell } from '../OdsCell/ProductStatusCell';
import ReactFormatter from './OdsFormatter';
import { deleteRancherService, deleteRancherServiceQueryKey } from '@/api';

interface LinkServiceInterface {
  cellData?: string;
  onClick: (cell?: string) => void;
}

interface DatagridWrapperInterface {
  data: RancherService[];
}

function LinkService({ cellData, onClick }: LinkServiceInterface) {
  return (
    <OsdsLink
      color={ODS_THEME_COLOR_INTENT.primary}
      onClick={() => onClick(cellData)}
    >
      {cellData}
    </OsdsLink>
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

  const columns: OdsDatagridColumn[] = [
    {
      title: t('name'),
      field: 'currentState.name',
      formatter: ReactFormatter(
        <LinkService
          onClick={(cellData?: string) => {
            navigate(`/${cellData}`);
          }}
        />,
      ),
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
