import { NetworkVisibility } from '@/types/network.type';

const cidr = '10.1.0.0/16';

const privateNetworkForm = {
  region: 'RBX-1',
  name: 'test',
  subnet: {
    name: 'subnet',
    cidr,
    enableDhcp: true,
    enableGatewayIp: true,
    ipVersion: 4,
  },
  vlanId: 22,
  existingGatewayId: 'testExistingIdGateway',
  gateway: {
    model: 's',
    name: 'gateway1',
  },
};

const projectId = 'projectId';

const localZoneNetworks = [
  {
    id: 'net1',
    name: 'net1',
    region: 'region1',
    vlanId: null,
    visibility: NetworkVisibility.Private,
  },
  {
    id: 'net2',
    name: 'net2',
    region: 'region2',
    vlanId: null,
    visibility: NetworkVisibility.Private,
  },
];

const networks = [
  {
    ...localZoneNetworks[0],
    vlanId: 34,
  },
  {
    ...localZoneNetworks[1],
    vlanId: 34,
  },
  {
    id: 'net3',
    name: 'net3',
    region: 'region3',
    vlanId: 1,
    visibility: NetworkVisibility.Private,
  },
  {
    id: 'net4',
    name: 'net4',
    region: 'region4',
    vlanId: null,
    visibility: NetworkVisibility.Private,
  },
  {
    id: 'net5',
    name: 'net5',
    region: 'region5',
    vlanId: 34,
    visibility: NetworkVisibility.Private,
  },
  {
    id: 'net6',
    name: 'net6',
    region: 'region6',
    vlanId: 34,
    visibility: NetworkVisibility.Private,
  },
];

export { privateNetworkForm, projectId, cidr, localZoneNetworks, networks };
