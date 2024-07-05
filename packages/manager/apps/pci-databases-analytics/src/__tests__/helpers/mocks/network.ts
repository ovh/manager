import {
  Network,
  NetworkRegionStatusEnum,
  NetworkStatusEnum,
  NetworkTypeEnum,
  Subnet,
} from '@/types/cloud/network';
import { Vrack } from '@/types/cloud/Vrack';

export const mockedNetworks: Network[] = [
  {
    id: 'id1',
    name: 'network1',
    regions: [
      {
        region: 'GRA',
        openstackId: 'networkId',
        status: NetworkRegionStatusEnum.ACTIVE,
      },
    ],
    vlanId: 0,
    status: NetworkStatusEnum.ACTIVE,
    type: NetworkTypeEnum.private,
  },
];
export const mockedSubnets: Subnet[] = [
  {
    cidr: 'cidr',
    dhcpEnabled: false,
    id: '1',
    ipPools: [
      { dhcp: false, network: '123', region: 'GRA11', start: '', end: '' },
    ],
    gatewayIp: 'gatewayIp',
  },
];

export const mockedVrack: Vrack = {
  description: 'description',
  id: 'vrackId',
  name: 'vrackName',
};

export const mockedNetworksFork: Network[] = [
  {
    id: 'id1',
    name: 'network1',
    regions: [
      {
        region: 'region',
        openstackId: 'networkId',
        status: NetworkRegionStatusEnum.ACTIVE,
      },
    ],
    vlanId: 0,
    status: NetworkStatusEnum.ACTIVE,
    type: NetworkTypeEnum.private,
  },
];
