import { useVrackService } from '@/data';

export type EndpointItem = {
  description: string;
  ip: string;
  subnet: string;
  managedServiceURN: string;
};

export const useEndpointsList = (): EndpointItem[] => {
  const { data: vrackServices } = useVrackService();
  return (
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
      ) || []
  );
};
