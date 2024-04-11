import {
  Network,
  NetworkRegionStatusEnum,
  NetworkStatusEnum,
  NetworkTypeEnum,
  Subnet,
  Vrack,
} from '@/models/network';

export const mockedNetworks: Network[] = [
  {
    id: 'id1',
    name: 'network1',
    regions: [
      {
        region: 'GRA',
        openstackId: '123456',
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
    ipPools: [],
    gatewayIp: 'gatewayIp',
  },
];

export const mockedVrack: Vrack = {
  description: 'description',
  id: 'vrackId',
  name: 'vrackName',
};