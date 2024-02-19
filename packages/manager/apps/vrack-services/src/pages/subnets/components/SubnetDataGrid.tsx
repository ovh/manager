/* eslint-disable import/prefer-default-export */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { OsdsDatagrid, OsdsMessage } from '@ovhcloud/ods-components/react';
import { ODS_MESSAGE_TYPE, OdsDatagridColumn } from '@ovhcloud/ods-components';
import { useParams } from 'react-router-dom';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { reactFormatter } from '@/utils/ods-utils';
import { DisplayNameCell, ActionsCell, CidrCell } from './SubnetDataGridCells';
import { ErrorPage } from '@/components/Error';
import { useVrackService, useUpdateVrackServices } from '@/utils/vs-utils';
import { DeleteModal } from '@/components/DeleteModal';

export const SubnetDatagrid: React.FC = () => {
  const { t } = useTranslation('vrack-services/subnets');
  const [openedDeleteModal, setOpenedDeleteModal] = React.useState<
    string | undefined
  >(undefined);
  const { id } = useParams();
  const { trackEvent, trackClick } = useOvhTracking();

  const { data: vrackServices, isError, error } = useVrackService();
  const {
    updateVS,
    isPending,
    updateError,
    isErrorVisible,
  } = useUpdateVrackServices({
    key: id,
    onSuccess: () => {
      setOpenedDeleteModal('');
    },
  });

  const columns: OdsDatagridColumn[] = [
    {
      title: t('displayName'),
      field: 'displayName',
      isSortable: true,
      formatter: reactFormatter(
        <DisplayNameCell
          updateVS={updateVS}
          vrackServices={vrackServices}
          trackEvent={trackEvent}
          trackClick={trackClick}
        />,
      ),
    },
    {
      title: t('cidr'),
      field: 'cidr',
      formatter: reactFormatter(<CidrCell />),
    },
    {
      title: t('serviceRange'),
      field: 'serviceRange.cidr',
    },
    {
      title: t('vlan'),
      field: 'vlan',
      formatter: (vlan: string) => vlan ?? '',
    },
    {
      title: t('actions'),
      field: '',
      formatter: reactFormatter(
        <ActionsCell
          openDeleteModal={setOpenedDeleteModal}
          vrackServices={vrackServices}
          isLoading={isPending}
          trackClick={trackClick}
        />,
      ),
    },
  ];

  if (isError) {
    return <ErrorPage error={error} />;
  }

  const subnetList = vrackServices?.currentState.subnets || [];

  return (
    <>
      {isErrorVisible && (
        <OsdsMessage type={ODS_MESSAGE_TYPE.error}>
          {t('updateError', { error: updateError?.response.data.message })}
        </OsdsMessage>
      )}
      <OsdsDatagrid
        hasHideableColumns={undefined}
        height={(subnetList.length + 1) * 150}
        rowHeight={60}
        columns={columns}
        rows={subnetList}
        noResultLabel={t('emptyDataGridMessage')}
      />
      <DeleteModal
        closeModal={() => setOpenedDeleteModal(undefined)}
        deleteInputLabel={t('modalDeleteInputLabel')}
        headline={t('modalDeleteHeadline')}
        description={t('modalDeleteDescription')}
        dataTrackingPath="subnets::delete"
        dataTrackingConfirmValue="confirm"
        dataTrackingCancelValue="cancel"
        onConfirmDelete={() =>
          updateVS(
            {
              checksum: vrackServices?.checksum,
              vrackServicesId: vrackServices?.id,
              targetSpec: {
                displayName: vrackServices?.currentState.displayName,
                subnets: vrackServices?.currentState.subnets.filter(
                  (subnet) => subnet.cidr !== openedDeleteModal,
                ),
              },
            },
            {
              onSuccess: () => {
                trackEvent({ path: 'subnets::delete', value: '-success' });
              },
              onError: () => {
                trackEvent({ path: 'subnets::delete', value: '-error' });
              },
            },
          )
        }
        error={updateError}
        isLoading={isPending}
        isModalOpen={!!openedDeleteModal}
      />
    </>
  );
};
