/* eslint-disable import/prefer-default-export */
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  OsdsSpinner,
  OsdsButton,
  OsdsIcon,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_TYPE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_SPINNER_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useNavigate, useParams } from 'react-router-dom';
import {
  PageLocation,
  ButtonType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import {
  ActionMenu,
  DataGridTextCell,
  Datagrid,
  DatagridColumn,
  useDataGrid,
} from '@ovhcloud/manager-components';
import { handleClick } from '@/utils/ods-utils';
import { ErrorPage } from '@/components/Error';
import { useVrackService, useServiceList, isEditable } from '@/api';
import { urls } from '@/router/constants';

type EndpointItem = {
  description: string;
  ip: string;
  subnet: string;
  managedServiceURN: string;
};

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

  const isVsEditable = isEditable(vrackServices);
  const { sorting, setSorting } = useDataGrid({
    id: 'managedServiceURN',
    desc: false,
  });

  const columns: DatagridColumn<EndpointItem>[] = [
    {
      id: 'managedServiceURN',
      label: t('managedServiceURN'),
      cell: ({ managedServiceURN }) => {
        const resource = iamResources?.data?.find(
          (iamResource) => iamResource.urn === managedServiceURN,
        );
        return (
          <DataGridTextCell>
            {resource?.displayName || resource?.name || resource?.id}
          </DataGridTextCell>
        );
      },
    },
    {
      id: 'serviceType',
      label: t('serviceType'),
      cell: ({ managedServiceURN }) => {
        const resource = iamResources?.data?.find(
          (iamResource) => iamResource.urn === managedServiceURN,
        );
        return <DataGridTextCell>{resource?.type}</DataGridTextCell>;
      },
    },
    {
      id: 'ip',
      label: t('ip'),
      cell: ({ ip }) => <DataGridTextCell>{ip}</DataGridTextCell>,
    },
    {
      id: 'subnet',
      label: t('subnet'),
      cell: ({ subnet }) => <DataGridTextCell>{subnet}</DataGridTextCell>,
    },
    {
      id: 'actions',
      label: t('actions'),
      cell: ({ managedServiceURN }) => (
        <ActionMenu
          isCompact
          disabled={!isVsEditable}
          items={[
            {
              id: 0,
              label: t('edit'),
              onClick: () => {
                trackClick({
                  location: PageLocation.datagrid,
                  buttonType: ButtonType.button,
                  actionType: 'navigation',
                  actions: ['edit-endpoints'],
                });
                navigate(
                  urls.endpointsEdit
                    .replace(':id', vrackServices.id)
                    .replace(':urn', managedServiceURN),
                );
              },
            },
            {
              id: 1,
              label: t('delete'),
              color: ODS_THEME_COLOR_INTENT.error,
              onClick: () => {
                trackClick({
                  location: PageLocation.datagrid,
                  buttonType: ButtonType.button,
                  actionType: 'navigation',
                  actions: ['delete-endpoints'],
                });
                navigate(
                  urls.endpointsDelete
                    .replace(':id', id)
                    .replace(':urn', managedServiceURN),
                );
              },
            },
          ]}
        />
      ),
    },
  ];

  if (isError || iamResourcesError || serviceListError) {
    return <ErrorPage error={error || iamResourcesError || serviceListError} />;
  }

  const endpointList: EndpointItem[] =
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

  return isServiceListLoading || isIamResourcesLoading || isLoading ? (
    <div>
      <OsdsSpinner inline size={ODS_SPINNER_SIZE.lg} />
    </div>
  ) : (
    <Datagrid
      wrapperStyle={{ display: 'flex' }}
      tableStyle={{ minWidth: '700px' }}
      className="pb-[200px] -mx-6"
      columns={columns}
      items={endpointList}
      totalItems={endpointList.length}
      sorting={sorting}
      onSortChange={setSorting}
      noResultLabel={t('emptyDataGridMessage')}
    />
  );
};
