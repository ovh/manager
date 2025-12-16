import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SPINNER_SIZE, Spinner, Text } from '@ovhcloud/ods-react';
import { useParams } from 'react-router-dom';
import { ColumnSort } from '@tanstack/react-table';
import { Datagrid, DatagridColumn, Error } from '@ovh-ux/muk';
import {
  useVrackService,
  useServiceList,
} from '@ovh-ux/manager-network-common';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  getIamResourceQueryKey,
  getIamResource,
} from '@/data/api/get/iamResource';
import { EndpointItem, useEndpointsList } from './useEndpointList.hook';
import { ActionCell } from './ActionCell.component';
import { TRANSLATION_NAMESPACES } from '@/utils/constants';
import { IAMResource } from '@/data/types';

export const EndpointDatagrid: React.FC = () => {
  const { t } = useTranslation([
    TRANSLATION_NAMESPACES.endpoints,
    NAMESPACES.DASHBOARD,
  ]);
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
  const [sorting, setSorting] = useState<ColumnSort[]>([
    {
      id: 'managedServiceURN',
      desc: false,
    },
  ]);

  const endpointList = useEndpointsList(sorting[0]);

  const findMatchingIAMResourceType = (endpoint: EndpointItem) =>
    iamResources?.data?.find(
      (iamResource: IAMResource) =>
        iamResource.urn === endpoint.managedServiceURN,
    )?.type;

  const columns: DatagridColumn<EndpointItem>[] = [
    {
      id: 'managedServiceURN',
      accessorKey: 'managedServiceURN',
      header: t('endpointDatagridManagedServiceURNLabel'),
      label: t('endpointDatagridManagedServiceURNLabel'),
      isSortable: true,
      cell: (cellContext) => {
        const resource = iamResources?.data?.find(
          (iamResource) =>
            iamResource.urn === cellContext.row.original.managedServiceURN,
        );
        return (
          <Text>
            {resource?.displayName ||
              resource?.name ||
              resource?.id ||
              t('none', { ns: NAMESPACES.DASHBOARD })}
          </Text>
        );
      },
    },
    {
      id: 'serviceType',
      header: t('endpointDatagridServiceTypeLabel'),
      label: t('endpointDatagridServiceTypeLabel'),
      isSortable: true,
      maxSize: 100,
      accessorFn: findMatchingIAMResourceType,
      cell: (cellContext) => {
        const resourceType = findMatchingIAMResourceType(
          cellContext.row.original,
        );
        return <Text>{resourceType}</Text>;
      },
    },
    {
      id: 'ip',
      header: t('endpointDatagridIpLabel'),
      label: t('endpointDatagridIpLabel'),
      isSortable: true,
      maxSize: 70,
      accessorKey: 'ip',
    },
    {
      id: 'subnet',
      header: t('endpointDatagridSubnetLabel'),
      label: t('endpointDatagridSubnetLabel'),
      isSortable: true,
      maxSize: 70,
      accessorKey: 'subnet',
    },
    {
      id: 'actions',
      header: t('endpointDatagridActionsLabel'),
      label: t('endpointDatagridActionsLabel'),
      isSortable: false,
      maxSize: 50,
      minSize: 50,
      cell: (cellContext) => (
        <ActionCell vs={vs} endpoint={cellContext.row.original} />
      ),
    },
  ];

  if (isError || iamResourcesError || serviceListError) {
    return <Error error={error || iamResourcesError || serviceListError} />;
  }

  return isServiceListLoading || isIamResourcesLoading || isLoading ? (
    <div>
      <Spinner size={SPINNER_SIZE.lg} />
    </div>
  ) : (
    <Datagrid
      data={endpointList}
      columns={columns}
      totalCount={endpointList.length}
      sorting={{
        sorting,
        setSorting,
        manualSorting: true,
      }}
    />
  );
};

export default EndpointDatagrid;
