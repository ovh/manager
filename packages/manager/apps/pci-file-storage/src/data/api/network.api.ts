import { v6 } from '@ovh-ux/manager-core-api';

import { TNetworkDto, TSubnetDto } from '@/adapters/network/right/dto.type';
import { mapNetworkDtoToNetwork, mapSubnetDtoToSubnet } from '@/adapters/network/right/mapper';
import { TNetwork, TSubnet } from '@/domain/entities/network.entity';

export const getNetworks = async ({
  projectId,
  region,
}: {
  projectId: string;
  region: string;
}): Promise<TNetwork[]> => {
  return v6
    .get<TNetworkDto[]>(`/cloud/project/${projectId}/region/${region}/network`)
    .then((response) => response.data.map(mapNetworkDtoToNetwork));
};

export const getSubnets = async ({
  projectId,
  region,
  networkId,
}: {
  projectId: string;
  region: string;
  networkId: string;
}): Promise<TSubnet[]> => {
  return v6
    .get<TSubnetDto[]>(`/cloud/project/${projectId}/region/${region}/network/${networkId}/subnet`)
    .then((response) => response.data.map(mapSubnetDtoToSubnet));
};
