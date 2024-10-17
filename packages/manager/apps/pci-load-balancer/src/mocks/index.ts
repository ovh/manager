import { TFlavor } from '@ovh-ux/manager-pci-common';
import { TLoadBalancer, TLoadBalancerListener } from '@/api/data/load-balancer';

export const mockLoadBalancer = {
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
} as TLoadBalancer;
export const mockLoadBalancers = [mockLoadBalancer] as TLoadBalancer[];

export const mockFlavor = {
  id: 'idFlavoer',
  name: 'flavorName',
  region: 'region',
} as TFlavor;

export const mockLoadBalancerListener = {
  id: 'id1',
  name: 'listener1',
  description: 'description',
} as TLoadBalancerListener;

export const mockLoadBalancerListeners = [mockLoadBalancerListener];
