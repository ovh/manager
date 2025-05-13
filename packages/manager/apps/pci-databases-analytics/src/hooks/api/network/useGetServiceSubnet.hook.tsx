import { Service } from '@/types/cloud/project/database';
import { useGetNetwork } from './useGetNetwork.hook';
import { useGetSubnet } from './useGetSubnet.hook';

export function useGetServiceSubnet(projectId: string, service: Service) {
  const privateNetworksQwery = useGetNetwork(projectId);
  const network = privateNetworksQwery.data?.find((p) =>
    p.regions.find((r) => r.openstackId === service.networkId),
  );
  const subnetQuery = useGetSubnet(projectId, network?.id, {
    enabled: !!network?.id,
  });
  const subnet = subnetQuery.data?.find((s) => s.id === service.subnetId);
  return subnet;
}
