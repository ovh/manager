/* eslint-disable import/prefer-default-export */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { OsdsSpinner, OsdsDatagrid } from '@ovhcloud/ods-components/react';
import { ODS_SPINNER_SIZE, OdsDatagridColumn } from '@ovhcloud/ods-components';
import { useParams } from 'react-router-dom';
import { useShell } from '@ovh-ux/manager-react-core-application';
import { reactFormatter } from '@/utils/ods-utils';
import { ActionsCell, ServiceName } from './EndpointDataGridCells';
import { ErrorPage } from '@/components/Error';
import {
  useVrackService,
  useUpdateVrackServices,
  useServiceList,
} from '@/utils/vs-utils';
import { VrackDeleteModal } from '@/components/VrackDeleteModal';

export const EndpointDatagrid: React.FC = () => {
  const { t } = useTranslation('vrack-services/endpoints');
  const [openedDeleteModal, setOpenedDeleteModal] = React.useState<
    string | undefined
  >(undefined);
  const { id } = useParams();
  const shell = useShell();

  const { data: vrackServices, isError, error, isLoading } = useVrackService();
  const { updateVS, isPending, updateError } = useUpdateVrackServices({
    key: id,
    onSuccess: () => setOpenedDeleteModal(''),
  });
  const {
    iamResources,
    isServiceListLoading,
    isIamResourcesLoading,
    iamResourcesError,
    serviceListResponse,
    serviceListError,
  } = useServiceList(id);

  const columns: OdsDatagridColumn[] = [
    {
      title: t('subnet'),
      field: 'subnet',
      isSortable: true,
    },
    {
      title: t('serviceType'),
      field: 'serviceType',
      isSortable: true,
    },
    {
      title: t('managedServiceURN'),
      field: 'managedServiceURN',
      isSortable: true,
      formatter: reactFormatter(
        <ServiceName iamResources={iamResources?.data} />,
      ),
    },
    {
      title: t('ip'),
      field: 'ip',
    },
    {
      title: t('description'),
      field: 'description',
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

  if (isError || iamResourcesError || serviceListError) {
    return <ErrorPage error={error || iamResourcesError || serviceListError} />;
  }

  const endpointList =
    vrackServices?.currentState.subnets
      .flatMap((subnet) =>
        subnet.serviceEndpoints.map((endpoint) => ({
          ...endpoint,
          subnet: subnet.displayName || subnet.cidr,
        })),
      )
      .flatMap((endpoint) =>
        endpoint.endpoints?.map(({ description, ip }) => ({
          description,
          ip,
          subnet: endpoint.subnet,
          managedServiceURN: endpoint.managedServiceURN,
          serviceType: serviceListResponse?.data.find((service) =>
            service.managedServiceURNs.includes(endpoint.managedServiceURN),
          )?.managedServiceType,
        })),
      ) || [];

  if (isServiceListLoading || isIamResourcesLoading || isLoading) {
    return (
      <div>
        <OsdsSpinner inline size={ODS_SPINNER_SIZE.lg} />
      </div>
    );
  }

  return (
    <>
      <OsdsDatagrid
        hasHideableColumns={undefined}
        height={(endpointList.length + 1) * 150}
        rowHeight={60}
        columns={columns}
        rows={endpointList}
        noResultLabel={t('emptyDataGridMessage')}
      />
      <VrackDeleteModal
        closeModal={() => setOpenedDeleteModal(undefined)}
        deleteInputLabel={t('modalDeleteInputLabel')}
        headline={t('modalDeleteHeadline')}
        description={t('modalDeleteDescription')}
        onDisplayDataTracking="vrack-services::endpoints::delete"
        confirmButtonDataTracking="vrack-services::endpoints::delete::confirm"
        cancelButtonDataTracking="vrack-services::endpoints::delete::cancel"
        onConfirmDelete={() =>
          updateVS(
            {
              checksum: vrackServices?.checksum,
              vrackServicesId: vrackServices?.id,
              targetSpec: {
                displayName: vrackServices?.currentState.displayName,
                subnets: vrackServices?.currentState.subnets.map((subnet) => ({
                  ...subnet,
                  serviceEndpoints: subnet.serviceEndpoints.filter(
                    (endpoint) =>
                      endpoint.managedServiceURN !== openedDeleteModal,
                  ),
                })),
              },
            },
            {
              onSuccess: async () => {
                await shell.tracking.trackEvent({
                  name: 'vrack-services::endpoints::delete-success',
                  level2: '',
                });
              },
              onError: async () => {
                await shell.tracking.trackEvent({
                  name: 'vrack-services::endpoints::delete-error',
                  level2: '',
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
