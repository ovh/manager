const cidr = '10.1.0.0/16';

const privateNetworkForm = {
  region: 'RBX-1',
  name: 'test',
  subnet: {
    cidr,
    enableDhcp: true,
    enableGatewayIp: true,
    ipVersion: 4,
  },
  defaultVlanId: 1,
  vlanId: 22,
  existingGatewayId: 'testExistingIdGateway',
  gateway: {
    model: 's',
    name: 'gateway1',
  },
};

const projectId = 'projectId';

export { privateNetworkForm, projectId, cidr };
