import { v6 } from '@ovh-ux/manager-core-api';
import { TNetwork } from '@/types/network/entity.type';
import { TNetworkDto } from '@/types/network/api.type';
import { mapNetworkDtoToNetwork } from './mapper/network.mapper';

export const getNetworks = ({
  projectId,
  region,
}: {
  projectId: string;
  region: string;
}): Promise<TNetwork[]> =>
  v6
    .get<TNetworkDto[]>(`/cloud/project/${projectId}/region/${region}/network`)
    .then((response) => response.data.map(mapNetworkDtoToNetwork));

export const getReverseDns = (ip: string): Promise<string[]> =>
  v6.get<string[]>(`/ip/${ip}/reverse`).then((response) => response.data);
