/* eslint-disable import/prefer-default-export */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { OsdsSpinner, OsdsDatagrid } from '@ovhcloud/ods-components/react';
import { ODS_SPINNER_SIZE, OdsDatagridColumn } from '@ovhcloud/ods-components';
import { useParams } from 'react-router-dom';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useQueryClient } from '@tanstack/react-query';
import { reactFormatter } from '@/utils/ods-utils';
import { ActionsCell, ServiceName, ServiceType } from './EndpointDataGridCells';
import { ErrorPage } from '@/components/Error';
import {
  useVrackService,
  useUpdateVrackServices,
  useServiceList,
} from '@/utils/vs-utils';
import { DeleteModal } from '@/components/DeleteModal';
import { getEligibleManagedServiceListQueryKey } from '@/api';

export const EndpointDatagrid: React.FC = () => {
  const { t } = useTranslation('vrack-services/endpoints');
  const [openedDeleteModal, setOpenedDeleteModal] = React.useState<
    string | undefined
  >(undefined);
  const { id } = useParams();
  const {
    shell: { tracking },
  } = React.useContext(ShellContext);
  const queryClient = useQueryClient();

  const { data: vrackServices, isError, error, isLoading } = useVrackService();
  const { updateVS, isPending, updateError } = useUpdateVrackServices({
    key: id,
    onSuccess: () => {
      setOpenedDeleteModal('');
      queryClient.invalidateQueries({
        queryKey: getEligibleManagedServiceListQueryKey(id),
      });
    },
  });
  const {
    iamResources,
    isServiceListLoading,
    isIamResourcesLoading,
    iamResourcesError,
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
      field: '',
      isSortable: true,
      formatter: reactFormatter(
        <ServiceType iamResources={iamResources?.data} />,
      ),
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
      <DeleteModal
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
                await tracking.trackEvent({
                  name: 'vrack-services::endpoints::delete-success',
                  level2: '0',
                });
              },
              onError: async () => {
                await tracking.trackEvent({
                  name: 'vrack-services::endpoints::delete-error',
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
