import { useParams } from 'react-router-dom';

import type { ColumnSort } from '@tanstack/react-table';

import { useServiceList, useVrackService } from '@ovh-ux/manager-network-common';

import { getIamResource, getIamResourceQueryKey } from '@/data/api/get/iamResource';
import { IAMResource } from '@/data/types/IAMResource.type';

export type EndpointItem = {
  description: string;
  ip: string;
  subnet: string;
  managedServiceURN: string;
};

const sortByManagedServiceURN = (
  resource1: IAMResource | undefined,
  resource2: IAMResource | undefined,
) => (resource1?.displayName || '').localeCompare(resource2?.displayName || '');

const sortByServiceType = (
  resource1: IAMResource | undefined,
  resource2: IAMResource | undefined,
) => (resource1?.type || '').localeCompare(resource2?.type || '');

const sortBySubnet = (e1: EndpointItem, e2: EndpointItem) =>
  (e1.subnet || '').localeCompare(e2.subnet || '');
const sortByIp = (e1: EndpointItem, e2: EndpointItem) => (e1.ip || '').localeCompare(e2.ip || '');

const sortEndpoints = (
  sorting: ColumnSort | undefined,
  iamResources: IAMResource[] = [],
  endpointList: EndpointItem[] = [],
) => {
  endpointList.sort((e1, e2) => {
    const resource1 = iamResources?.find((iamResource) => iamResource.urn === e1.managedServiceURN);
    const resource2 = iamResources?.find((iamResource) => iamResource.urn === e2.managedServiceURN);
    switch (sorting?.id ?? '') {
      case 'managedServiceURN':
        return sortByManagedServiceURN(resource1, resource2);
      case 'serviceType':
        return sortByServiceType(resource1, resource2);
      case 'subnet':
        return sortBySubnet(e1, e2);
      case 'ip':
        return sortByIp(e1, e2);
      default:
        return 0;
    }
  });

  return sorting?.desc ? endpointList.reverse() : endpointList;
};

export const useEndpointsList = (sorting: ColumnSort): EndpointItem[] => {
  const { id } = useParams();
  const { data: vrackServices } = useVrackService();
  const { iamResources } = useServiceList(id || '', {
    getIamResourceQueryKey,
    getIamResource,
  });

  const list =
    vrackServices?.currentState.subnets
      ?.flatMap((subnet) =>
        subnet.serviceEndpoints.map((endpoint) => ({
          ...endpoint,
          subnet: subnet.displayName || subnet.cidr,
        })),
      )
      .flatMap(
        (endpoint) =>
          endpoint.endpoints?.map(({ description, ip }) => ({
            description,
            ip,
            subnet: endpoint.subnet,
            managedServiceURN: endpoint.managedServiceURN,
          })) || [],
      )
      .filter((item): item is EndpointItem => Boolean(item)) || [];

  return sortEndpoints(sorting, iamResources?.data, list);
};
