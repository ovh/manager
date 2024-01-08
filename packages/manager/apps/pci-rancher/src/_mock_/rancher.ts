import { RancherService, RessourceStatus } from '@/api/api.type';

export const rancherMocked = {
  id: '123',
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
  },
  currentTasks: [],
  resourceStatus: RessourceStatus.READY,
} as RancherService;

export const rancherError = {
  ...rancherMocked,
  resourceStatus: RessourceStatus.ERROR,
} as RancherService;
