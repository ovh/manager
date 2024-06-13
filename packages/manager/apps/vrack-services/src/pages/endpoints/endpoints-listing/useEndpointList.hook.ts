import { ColumnSort } from '@ovhcloud/manager-components';
import { useParams } from 'react-router-dom';
import { IAMResource, useServiceList, useVrackService } from '@/data';

export type EndpointItem = {
  description: string;
  ip: string;
  subnet: string;
  managedServiceURN: string;
};

const sortEndpoints = (
  sorting: ColumnSort,
  iamResources: IAMResource[] = [],
  endpointList: EndpointItem[] = [],
) => {
  endpointList.sort((e1, e2) => {
    const resource1 = iamResources?.find(
      (iamResource) => iamResource.urn === e1.managedServiceURN,
    );
    const resource2 = iamResources?.find(
      (iamResource) => iamResource.urn === e2.managedServiceURN,
    );
    switch (sorting.id) {
      case 'managedServiceURN':
        return resource1?.displayName?.localeCompare(resource2?.displayName);
      case 'serviceType':
        return resource1?.type?.localeCompare(resource2?.type);
      case 'subnet':
        return e1.subnet?.localeCompare(e2.subnet);
      case 'ip':
        return e1.ip?.localeCompare(e2.ip);
      default:
        return 0;
    }
  });

  return sorting.desc ? endpointList.reverse() : endpointList;
};

export const useEndpointsList = (sorting: ColumnSort): EndpointItem[] => {
  const { id } = useParams();
  const { data: vrackServices } = useVrackService();
  const { iamResources } = useServiceList(id);

  const list =
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

  return sortEndpoints(sorting, iamResources?.data, list);
};
