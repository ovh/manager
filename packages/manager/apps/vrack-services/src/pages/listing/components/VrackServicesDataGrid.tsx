/* eslint-disable import/prefer-default-export */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { OsdsDatagrid, OsdsMessage } from '@ovhcloud/ods-components/react';
import { ODS_MESSAGE_TYPE, OdsDatagridColumn } from '@ovhcloud/ods-components';
import { useNavigate } from 'react-router-dom';
import { VrackAssociationModal } from '@/components/VrackAssociationModal';
import { reactFormatter } from '@/utils/ods-utils';
import {
  DisplayNameCell,
  ActionsCell,
  ProductStatusCell,
  VrackIdCell,
} from '@/components/VrackServicesDataGridCells';
import { useUpdateVrackServices, useVrackServicesList } from '@/utils/vs-utils';
import { DeleteModal } from '@/components/DeleteModal';

export const VrackServicesDatagrid: React.FC = () => {
  const [associateModalVisible, setAssociateModalVisible] = React.useState<
    string | undefined
  >(undefined);
  const [openedDeleteModal, setOpenedDeleteModal] = React.useState<
    string | undefined
  >(undefined);
  const { t, i18n } = useTranslation('vrack-services/listing');
  const navigate = useNavigate();
  const {
    updateVS,
    isPending,
    isErrorVisible,
    updateError,
    hideError,
  } = useUpdateVrackServices({ key: 'listing' });

  const { data } = useVrackServicesList();

  const columns: OdsDatagridColumn[] = [
    {
      title: t('displayName'),
      field: 'currentState.displayName',
      isSortable: true,
      formatter: reactFormatter(
        <DisplayNameCell navigate={navigate} updateVS={updateVS} />,
      ),
    },
    {
      title: t('productStatus'),
      field: 'currentState.productStatus',
      isSortable: true,
      formatter: reactFormatter(<ProductStatusCell t={t} />),
    },
    {
      title: t('zone'),
      field: 'currentState.zone',
      isSortable: true,
      formatter: (zone: string) => t(zone),
    },
    {
      title: t('vrackId'),
      field: 'currentState.vrackId',
      formatter: reactFormatter(
        <VrackIdCell
          label={t('associateVrackButtonLabel')}
          isLoading={isPending}
          openAssociationModal={setAssociateModalVisible}
        />,
      ),
    },
    {
      title: t('createdAt'),
      field: 'createdAt',
      isSortable: true,
      formatter: (createdAt: string) => {
        const date = new Date(createdAt);
        return date.toString() !== 'Invalid Date'
          ? date.toLocaleDateString(i18n.language)
          : '-';
      },
    },
    {
      title: t('actions'),
      field: '',
      formatter: reactFormatter(
        <ActionsCell openModal={setOpenedDeleteModal} isLoading={isPending} />,
      ),
    },
  ];

  return (
    <>
      {isErrorVisible && (
        <OsdsMessage
          type={ODS_MESSAGE_TYPE.error}
          removable
          onOdsRemoveClick={hideError}
        >
          {t('updateError', {
            error: updateError?.response.data.message,
            interpolation: { escapeValue: false },
          })}
        </OsdsMessage>
      )}
      <OsdsDatagrid
        hasHideableColumns={undefined}
        height={(data?.data.length + 1) * 150}
        rowHeight={60}
        columns={columns}
        rows={data?.data}
        noResultLabel={t('emptyDataGridMessage')}
      />
      <VrackAssociationModal
        vrackServicesId={associateModalVisible}
        closeModal={() => setAssociateModalVisible(undefined)}
      />
      <DeleteModal
        closeModal={() => setOpenedDeleteModal(undefined)}
        deleteInputLabel={t('modalDeleteInputLabel')}
        headline={t('modalDeleteHeadline')}
        onConfirmDelete={() => console.log(`delete ${openedDeleteModal}`)}
        isModalOpen={!!openedDeleteModal}
      />
    </>
  );
};
