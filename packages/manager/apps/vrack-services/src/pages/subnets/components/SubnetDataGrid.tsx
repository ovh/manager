/* eslint-disable import/prefer-default-export */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { OsdsDatagrid, OsdsMessage } from '@ovhcloud/ods-components/react';
import { ODS_MESSAGE_TYPE, OdsDatagridColumn } from '@ovhcloud/ods-components';
import { useParams } from 'react-router-dom';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
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
  const {
    shell: { tracking },
  } = React.useContext(ShellContext);

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
          trackEvent={tracking.trackEvent as any}
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
          {t('updateError', {
            error: updateError?.response.data.message,
            interpolation: { escapeValue: false },
          })}
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
        cancelButtonDataTracking="vrack-services::subnets::delete::cancel"
        confirmButtonDataTracking="vrack-services::subnets::delete::confirm"
        onDisplayDataTracking="vrack-services::subnets::delete"
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
                tracking.trackEvent({
                  name: 'vrack-services::subnets::delete-success',
                  level2: '0',
                });
              },
              onError: () => {
                tracking.trackEvent({
                  name: 'vrack-services::subnets::delete-error',
                  level2: '0',
                });
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
