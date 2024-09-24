import { TLoadBalancer } from '@/types';

export const mockLoadBalancers = [
  {
    id: 'idLoadBalancer1',
    name: 'mockLoadBalancer1',
    createdAt: '2024-07-15T12:13:04Z',
    updatedAt: '2024-07-15T12:15:03Z',
    flavorId: 'flavor',
    operatingStatus: 'online',
    provisioningStatus: 'active',
    vipAddress: '1.1.1.1',
    vipNetworkId: 'networkId',
    vipSubnetId: 'subnetId',
    region: 'region',
  },
] as TLoadBalancer[];
