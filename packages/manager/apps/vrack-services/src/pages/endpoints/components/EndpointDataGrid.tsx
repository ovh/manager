/* eslint-disable import/prefer-default-export */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { OsdsSpinner, OsdsDatagrid } from '@ovhcloud/ods-components/react';
import { ODS_SPINNER_SIZE, OdsDatagridColumn } from '@ovhcloud/ods-components';
import { useNavigate, useParams } from 'react-router-dom';
import {
  PageLocation,
  ButtonType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { reactFormatter } from '@/utils/ods-utils';
import {
  ActionsCell,
  ServiceName,
  ServiceType,
  TextCell,
} from './EndpointDataGridCells';
import { ErrorPage } from '@/components/Error';
import { useVrackService, useServiceList } from '@/utils/vs-utils';
import { urls } from '@/router/constants';

export const EndpointDatagrid: React.FC = () => {
  const { t } = useTranslation('vrack-services/endpoints');
  const { id } = useParams();
  const { trackClick } = useOvhTracking();
  const navigate = useNavigate();

  const { data: vrackServices, isError, error, isLoading } = useVrackService();
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
      formatter: reactFormatter(<TextCell />),
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
      formatter: reactFormatter(<TextCell />),
    },
    {
      title: t('actions'),
      field: '',
      formatter: reactFormatter(
        <ActionsCell
          openDeleteModal={(urn) => {
            trackClick({
              location: PageLocation.datagrid,
              buttonType: ButtonType.button,
              actionType: 'navigation',
              actions: ['delete-endpoints'],
            });
            navigate(
              urls.endpointsDelete.replace(':id', id).replace(':urn', urn),
            );
          }}
          vrackServices={vrackServices}
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
    <OsdsDatagrid
      hasHideableColumns={undefined}
      height={(endpointList.length + 1) * 150}
      rowHeight={60}
      columns={columns}
      rows={endpointList}
      noResultLabel={t('emptyDataGridMessage')}
    />
  );
};
