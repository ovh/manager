/* eslint-disable import/prefer-default-export, @typescript-eslint/ban-ts-comment */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { OsdsDatagrid } from '@ovhcloud/ods-components/datagrid/react';
import { OdsDatagridColumn } from '@ovhcloud/ods-components/datagrid';
import { useNavigate } from 'react-router-dom';
import { OsdsMessage } from '@ovhcloud/ods-components/message/react';
import { ODS_MESSAGE_TYPE } from '@ovhcloud/ods-components/message';
import { VrackAssociationModal } from './VrackAssociationModal';
import {
  ResponseData,
  VrackServices,
  VrackServicesWithIAM,
  getVrackServicesResourceListQueryKey,
  updateVrackServicesQueryKey,
  updateVrackServices,
  UpdateVrackServicesParams,
} from '@/api';
import { reactFormatter } from '@/utils/ods-utils';
import {
  DisplayNameCell,
  ActionsCell,
  ProductStatusCell,
  VrackIdCell,
} from './VrackServicesDataGridCells';
import { formatDateString } from '@/utils/date';
import { ApiError } from '@/components/Error';

export const VrackServicesDatagrid: React.FC = () => {
  const [isErrorVisible, setErrorVisible] = React.useState(false);
  const [associateModalVisible, setAssociateModalVisible] = React.useState<
    string | undefined
  >(undefined);
  const { t, i18n } = useTranslation('vrack-services/listing');
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data } = useQuery<ResponseData<VrackServicesWithIAM[]>>({
    queryKey: getVrackServicesResourceListQueryKey,
  });

  const { mutateAsync: updateVS, isLoading, isError } = useMutation<
    ResponseData<VrackServices>,
    ResponseData<ApiError>,
    UpdateVrackServicesParams
  >({
    mutationFn: updateVrackServices,
    mutationKey: updateVrackServicesQueryKey('listing'),
    onSuccess: (result: ResponseData<VrackServices>) => {
      queryClient.setQueryData(
        getVrackServicesResourceListQueryKey,
        ({ data: listingData, ...rest }: ResponseData<VrackServices[]>) => ({
          data: listingData.map((vrackServices) =>
            vrackServices.id === result.data.id ? result.data : vrackServices,
          ),
          ...rest,
        }),
      );
    },
  });

  React.useEffect(() => {
    if (isError) {
      setErrorVisible(true);
    }
  }, [isError]);

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
          isLoading={isLoading}
          openAssociationModal={setAssociateModalVisible}
        />,
      ),
    },
    {
      title: t('createdAt'),
      field: 'createdAt',
      isSortable: true,
      formatter: (createdAt: string) =>
        formatDateString(createdAt, i18n.language),
    },
    {
      title: t('actions'),
      field: '',
      formatter: reactFormatter(<ActionsCell isLoading={isLoading} />),
    },
  ];

  return (
    <>
      {isError && isErrorVisible && (
        <OsdsMessage
          type={ODS_MESSAGE_TYPE.error}
          removable
          onOdsRemoveClick={() => setErrorVisible(false)}
        >
          {t('updateError')}
        </OsdsMessage>
      )}
      <OsdsDatagrid
        hasHideableColumns={undefined}
        height={(data.data.length + 1) * 150}
        rowHeight={80}
        columns={columns}
        rows={data.data}
        noResultLabel={t('emptyDataGridMessage')}
      />
      <VrackAssociationModal
        vrackServicesId={associateModalVisible}
        closeModal={() => setAssociateModalVisible(undefined)}
      />
    </>
  );
};
