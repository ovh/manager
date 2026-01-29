import { v6 } from '@ovh-ux/manager-core-api';
import { TPrivateNetwork } from '@/domain/entities/configuration';
import { TNetworkDTO } from '../../adapters/tanstack/configuration/right/dto.type';
import { mapNetworkDtoToPrivateNetworkEntity } from '@/adapters/tanstack/configuration/right/mapper';

type TGetPrivateNetworksArgs = {
  projectId: string;
};

export const getPrivateNetworks = async ({
  projectId,
}: TGetPrivateNetworksArgs): Promise<TPrivateNetwork> =>
  v6
    .get<TNetworkDTO>(`/cloud/project/${projectId}/aggregated/network`)
    .then((response) => mapNetworkDtoToPrivateNetworkEntity(response.data));
