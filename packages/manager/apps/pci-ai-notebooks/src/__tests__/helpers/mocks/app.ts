import * as ai from '@/types/cloud/project/ai';
import { mockedDataSync } from './datasync';

export const mockedAppSpec: ai.app.AppSpec = {
  command: ['command'],
  defaultHttpPort: 8080,
  deploymentStrategy: {
    maxSurge: 'maxSurge',
    maxUnavailable: 'maxUnavailable',
    progressDeadlineSeconds: 120,
  },
  grpcPort: 8080,
  image: 'image',
  name: 'name',
  region: 'region',
  resources: {
    cpu: 20,
    ephemeralStorage: 20,
    flavor: 'flavor',
    gpu: 2,
    memory: 180,
    privateNetwork: 80,
    publicNetwork: 60,
  },
  unsecureHttp: false,
  scalingStrategy: {
    fixed: {
      replicas: 1,
    },
  },
};

export const mockedAppStatus: ai.app.AppStatus = {
  availableReplicas: 2,
  dataSync: [mockedDataSync],
  history: [
    {
      date: '2020/02/04',
      state: ai.app.AppStateEnum.QUEUED,
    },
  ],
  info: {
    code: ai.InfoCodeEnum.APP_QUEUED,
    message: 'message',
  },
};

export const mockedApp: ai.app.App = {
  createdAt: 'createdAt',
  id: 'appId',
  spec: mockedAppSpec,
  status: mockedAppStatus,
  updatedAt: 'updatedAt',
  user: 'user',
};
