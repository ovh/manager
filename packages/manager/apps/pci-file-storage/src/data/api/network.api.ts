import { v6 } from '@ovh-ux/manager-core-api';

import { TNetworkDto } from '@/adapters/network/right/dto.type';
import { mapNetworkDtoToNetwork } from '@/adapters/network/right/mapper';
import { TNetwork } from '@/domain/entities/network.entity';

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
