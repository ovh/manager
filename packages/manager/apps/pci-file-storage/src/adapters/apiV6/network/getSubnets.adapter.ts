import { v6 } from '@ovh-ux/manager-core-api';

import { TSubnetDto } from '@/adapters/network/right/dto.type';
import { mapSubnetDtoToSubnet } from '@/adapters/network/right/mapper';
import { GetSubnetsPort } from '@/application/ports/getSubnets.port';

export const getSubnetsAdapter: GetSubnetsPort = {
  getSubnets: async (query) => {
    const response = await v6.get<TSubnetDto[]>(
      `/cloud/project/${query.projectId}/region/${query.region}/network/${query.networkId}/subnet`,
    );

    return response.data.map(mapSubnetDtoToSubnet);
  },
};
