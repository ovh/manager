import { v6 } from '@ovh-ux/manager-core-api';

import {
  TLoadBalancerFlavorDTO,
  TResizeLoadBalancerFlavorDTO,
} from '@/adapters/tanstack/loadBalancerFlavor/right/dto.type';
import { mapLoadBalancerFlavorsDTOToEntity } from '@/adapters/tanstack/loadBalancerFlavor/right/mapper';
import { TLoadBalancerFlavor } from '@/domain/entities/loadBalancerFlavor';

type TGetLoadBalancerFlavorsArgs = {
  projectId: string;
  region: string;
};

export const getLoadBalancerFlavors = async ({
  projectId,
  region,
}: TGetLoadBalancerFlavorsArgs): Promise<TLoadBalancerFlavor[]> => {
  const { data } = await v6.get<TLoadBalancerFlavorDTO[]>(
    `/cloud/project/${projectId}/region/${region}/loadbalancing/flavor`,
  );
  return mapLoadBalancerFlavorsDTOToEntity(data);
};

export const resizeLoadBalancerFlavor = async ({
  projectId,
  region,
  loadBalancerId,
  flavor,
}: {
  projectId: string;
  region: string;
  loadBalancerId: string;
  flavor: TResizeLoadBalancerFlavorDTO;
}): Promise<void> => {
  await v6.put(
    `/cloud/project/${projectId}/region/${region}/loadbalancing/loadbalancer/${loadBalancerId}`,
    flavor,
  );
};
