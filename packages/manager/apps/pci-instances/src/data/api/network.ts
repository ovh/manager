import { v6 } from '@ovh-ux/manager-core-api';
import { TNetwork } from '@/types/network/entity.type';
import { TNetworkDto } from '@/types/network/api.type';
import { mapNetworkDtoToNetwork } from './mapper/network.mapper';

export const getNetwork = ({
  projectId,
  region,
}: {
  projectId: string;
  region: string;
}): Promise<TNetwork[]> =>
  v6
    .get<TNetworkDto[]>(`/cloud/project/${projectId}/region/${region}/network`)
    .then((response) => response.data.map(mapNetworkDtoToNetwork));
