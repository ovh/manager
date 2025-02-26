import * as ai from '@/types/cloud/project/ai';
import { mockedDataSync } from './datasync';
import { Scaling } from '@/types/orderFunnel';

export const mockedScaling: Scaling = {
  autoScaling: true,
  averageUsageTarget: 75,
  resourceType: ai.app.ScalingAutomaticStrategyResourceTypeEnum.CPU,
  replicasMin: 2,
  replicasMax: 3,
  replicas: 2,
};

export const mockedAppUpdate: ai.app.UpdateInput = {
  command: ['command'],
  cpu: 1,
  defaultHttpPort: 8080,
  flavor: 'flavor',
  gpu: 1,
  grpcPort: 8080,
  url: 'test',
};

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
  url: 'https://myappurl.com',
};

export const mockedApp: ai.app.App = {
  createdAt: '2020/02/02',
  id: 'appId',
  spec: mockedAppSpec,
  status: mockedAppStatus,
  updatedAt: '2020/02/02',
  user: 'user',
};
