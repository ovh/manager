import React from 'react';
import { useTranslation } from 'react-i18next';
import { OsdsSpinner } from '@ovhcloud/ods-components/react';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { useParams } from 'react-router-dom';
import {
  DataGridTextCell,
  Datagrid,
  DatagridColumn,
  useDataGrid,
} from '@ovhcloud/manager-components';
import { ErrorPage } from '@/components/ErrorPage.component';
import { useVrackService, useServiceList } from '@/data';
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
  } = useServiceList(id);
  const endpointList = useEndpointsList();

  const { sorting, setSorting } = useDataGrid({
    id: 'managedServiceURN',
    desc: false,
  });

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
      cell: (endpoint) => <ActionCell vs={vs} endpoint={endpoint} />,
    },
  ];

  if (isError || iamResourcesError || serviceListError) {
    return <ErrorPage error={error || iamResourcesError || serviceListError} />;
  }

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
      noResultLabel={t('endpointsEmptyDataGridMessage')}
    />
  );
};

export default EndpointDatagrid;
