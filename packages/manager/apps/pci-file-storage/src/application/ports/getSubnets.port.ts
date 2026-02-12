import { TSubnet } from '@/domain/entities/network.entity';

export type GetSubnetsPort = {
  getSubnets: (query: {
    projectId: string;
    region: string;
    networkId: string;
  }) => Promise<TSubnet[]>;
};
