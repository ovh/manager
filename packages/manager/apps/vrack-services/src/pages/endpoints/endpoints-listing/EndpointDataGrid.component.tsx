import React from 'react';
import { useTranslation } from 'react-i18next';
import { OdsSpinner } from '@ovhcloud/ods-components/react';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { useParams } from 'react-router-dom';
import {
  DataGridTextCell,
  Datagrid,
  DatagridColumn,
  useDataGrid,
  ErrorBanner,
} from '@ovh-ux/manager-react-components';
import {
  useVrackService,
  useServiceList,
} from '@ovh-ux/manager-network-common';
import {
  getIamResourceQueryKey,
  getIamResource,
} from '@/data/api/get/iamResource';
import { EndpointItem, useEndpointsList } from './useEndpointList.hook';
import { ActionCell } from './ActionCell.component';

export const EndpointDatagrid: React.FC = () => {
  const { t } = useTranslation('vrack-services/endpoints');
  const { id } = useParams();

  const { data: vs, isError, error, isLoading } = useVrackService();
  const {
    iamResources,
    isServiceListLoading,
    isIamResourcesLoading,
    iamResourcesError,
    serviceListError,
  } = useServiceList(id, {
    getIamResourceQueryKey,
    getIamResource,
  });

  const { sorting, setSorting } = useDataGrid({
    id: 'managedServiceURN',
    desc: false,
  });

  const endpointList = useEndpointsList(sorting);

  const columns: DatagridColumn<EndpointItem>[] = [
    {
      id: 'managedServiceURN',
      label: t('endpointDatagridManagedServiceURNLabel'),
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
      label: t('endpointDatagridServiceTypeLabel'),
      cell: ({ managedServiceURN }) => {
        const resource = iamResources?.data?.find(
          (iamResource) => iamResource.urn === managedServiceURN,
        );
        return <DataGridTextCell>{resource?.type}</DataGridTextCell>;
      },
    },
    {
      id: 'ip',
      label: t('endpointDatagridIpLabel'),
      cell: ({ ip }) => <DataGridTextCell>{ip}</DataGridTextCell>,
    },
    {
      id: 'subnet',
      label: t('endpointDatagridSubnetLabel'),
      cell: ({ subnet }) => <DataGridTextCell>{subnet}</DataGridTextCell>,
    },
    {
      id: 'actions',
      label: t('endpointDatagridActionsLabel'),
      isSortable: false,
      cell: (endpoint) => <ActionCell vs={vs} endpoint={endpoint} />,
    },
  ];

  if (isError || iamResourcesError || serviceListError) {
    return (
      <ErrorBanner error={error || iamResourcesError || serviceListError} />
    );
  }

  return isServiceListLoading || isIamResourcesLoading || isLoading ? (
    <div>
      <OdsSpinner size={ODS_SPINNER_SIZE.lg} />
    </div>
  ) : (
    <Datagrid
      className="pb-[200px] -mx-6"
      columns={columns}
      items={endpointList}
      totalItems={endpointList.length}
      sorting={sorting}
      onSortChange={setSorting}
      noResultLabel={t('endpointsEmptyDataGridMessage')}
    />
  );
};

export default EndpointDatagrid;
