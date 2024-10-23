import { RancherService, ResourceStatus } from '@/types/api.type';

export const rancherMocked: RancherService = {
  id: '123',
  createdAt: '0',
  updatedAt: '0',
  targetSpec: {
    name: 'rancher1',
    plan: 'OVHCLOUD_EDITION',
    version: '2.7.6',
    ipRestrictions: [
      {
        cidrBlock: 'cidrBlock',
        description: 'description',
      },
    ],
  },
  currentState: {
    url: 'www.ovh.com',
    name: 'rancher1',
    plan: 'OVHCLOUD_EDITION',
    region: 'region',
    version: '2.7.6',
    usage: {
      datetime: '2023-12-12',
      orchestratedVcpus: 2,
    },
    networking: {
      egressCidrBlocks: ['192.0.2.0/24', '198.51.100.0/24'],
    },
  },
  currentTasks: [],
  resourceStatus: ResourceStatus.READY,
};

export const rancherError: RancherService = {
  ...rancherMocked,
  resourceStatus: ResourceStatus.ERROR,
};
