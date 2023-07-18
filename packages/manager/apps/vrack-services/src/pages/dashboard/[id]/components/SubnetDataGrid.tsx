/* eslint-disable import/prefer-default-export */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { OsdsDatagrid } from '@ovhcloud/ods-components/datagrid/react';
import { OdsDatagridColumn } from '@ovhcloud/ods-components/datagrid';
import { useParams } from 'react-router-dom';
import { reactFormatter } from '@/utils/ods-utils';
import { DisplayNameCell, ActionsCell, CidrCell } from './SubnetDataGridCells';
import { ErrorPage } from '@/components/Error';
import { useVrackService, useUpdateVrackServices } from '@/utils/vs-utils';
import { VrackDeleteModal } from '@/components/VrackDeleteModal';

export const SubnetDatagrid: React.FC = () => {
  const { t } = useTranslation('vrack-services/subnets');
  const [openedDeleteModal, setOpenedDeleteModal] = React.useState<
    string | undefined
  >(undefined);
  const { id } = useParams();

  const { data: vrackServices, isError, error } = useVrackService();
  const { updateVS, isPending, updateError } = useUpdateVrackServices({
    key: id,
    onSuccess: () => setOpenedDeleteModal(''),
  });

  const columns: OdsDatagridColumn[] = [
    {
      title: t('displayName'),
      field: 'displayName',
      isSortable: true,
      formatter: reactFormatter(
        <DisplayNameCell updateVS={updateVS} vrackServices={vrackServices} />,
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
      <OsdsDatagrid
        hasHideableColumns={undefined}
        height={(subnetList.length + 1) * 150}
        rowHeight={60}
        columns={columns}
        rows={subnetList}
        noResultLabel={t('emptyDataGridMessage')}
      />
      <VrackDeleteModal
        closeModal={() => setOpenedDeleteModal(undefined)}
        deleteInputLabel={t('modalDeleteInputLabel')}
        headline={t('modalDeleteHeadline')}
        description={t('modalDeleteDescription')}
        onConfirmDelete={() =>
          updateVS({
            checksum: vrackServices?.checksum,
            vrackServicesId: vrackServices?.id,
            targetSpec: {
              displayName: vrackServices?.currentState.displayName,
              subnets: vrackServices?.currentState.subnets.filter(
                (subnet) => subnet.cidr !== openedDeleteModal,
              ),
            },
          })
        }
        error={updateError}
        isLoading={isPending}
        isModalOpen={!!openedDeleteModal}
      />
    </>
  );
};
