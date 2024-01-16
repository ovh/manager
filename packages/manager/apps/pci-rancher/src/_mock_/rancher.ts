import { RancherService, RessourceStatus } from '@/api/api.type';

export const rancherMocked: RancherService = {
  id: '123',
  createdAt: '0',
  updatedAt: '0',
  targetSpec: {
    name: 'Rancher 1',
    plan: 'string',
    version: 'string',
    ipRestrictions: [
      {
        cidrBlock: 'string',
        description: 'string',
      },
    ],
  },
  currentState: {
    url: 'string',
    name: 'rancher 1',
    plan: 'string',
    region: 'string',
    version: 'string',
    usage: {
      datetime: 'string',
      orchestratedVcpus: 0,
    },
  },
  currentTasks: [],
  resourceStatus: RessourceStatus.READY,
};

export const rancherError: RancherService = {
  ...rancherMocked,
  resourceStatus: RessourceStatus.ERROR,
};
