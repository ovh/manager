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
  DataGridTextCell,
  Datagrid,
  DatagridColumn,
  useDataGrid,
} from '@ovhcloud/manager-components';
import { handleClick } from '@/utils/ods-utils';
import { ErrorPage } from '@/components/Error';
import { useVrackService, useServiceList, isEditable } from '@/utils/vs-utils';
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
        <OsdsButton
          inline
          circle
          color={ODS_THEME_COLOR_INTENT.error}
          variant={ODS_BUTTON_VARIANT.ghost}
          type={ODS_BUTTON_TYPE.button}
          size={ODS_BUTTON_SIZE.sm}
          disabled={!isVsEditable || undefined}
          {...handleClick(() => {
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
          })}
        >
          <OsdsIcon
            color={ODS_THEME_COLOR_INTENT.error}
            name={ODS_ICON_NAME.TRASH}
            size={ODS_ICON_SIZE.xs}
          />
        </OsdsButton>
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
      className="overflow-x-hidden px-0"
      columns={columns}
      items={endpointList}
      totalItems={endpointList.length}
      sorting={sorting}
      onSortChange={setSorting}
      noResultLabel={t('emptyDataGridMessage')}
    />
  );
};

export default EndpointDatagrid;
