import { RancherService, RessourceStatus } from '../api/api.type';

export const rancherMocked: RancherService = {
  id: '123',
  createdAt: '0',
  updatedAt: '0',
  targetSpec: {
    name: 'rancher1',
    plan: 'OVH_CLOUD_EDITIOn',
    version: 'v2.7.6',
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
    plan: 'OVH_CLOUD_EDITIOn',
    region: 'region',
    version: 'v2.7.6',
    usage: {
      datetime: '2023-12-12',
      orchestratedVcpus: 2,
    },
  },
  currentTasks: [],
  resourceStatus: RessourceStatus.READY,
};

export const rancherError: RancherService = {
  ...rancherMocked,
  resourceStatus: RessourceStatus.ERROR,
};
