export const floatingIps = [
  {
    id: 'floating-id',
    ip: 'test-ip',
    networkId: 'network-id',
    status: 'active',
    associatedEntity: {
      id: 'entity-id',
      type: 'instance',
      ip: 'instance-ip',
      gatewayId: 'gateway-id-test',
    },
  },
  {
    id: 'floating-id2',
    ip: 'test-ip2',
    networkId: 'network-id2',
    status: 'active',
    associatedEntity: null,
  },
];
