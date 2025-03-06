import * as ai from '@datatr-ux/ovhcloud-types/cloud/project/ai/index';
import { mockedDataSync } from '../volume/datasync';
import { mockedAutoScaling, mockedFixedScaling } from './appHelper';
import { mockedCPUResources, mockedGPUResources } from '../shared/resource';
import {
  mockedGitVolume,
  mockedPublicGitVolume,
  mockedS3Volume,
} from '../volume/volume';

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
  image: 'docker:image-sentiment-analysis',
  name: 'my-new-image',
  region: 'GRA',
  resources: mockedCPUResources,
  unsecureHttp: false,
  scalingStrategy: mockedFixedScaling,
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

export const mockedAppAutoScalingGPU: ai.app.App = {
  ...mockedApp,
  spec: {
    ...mockedAppSpec,
    scalingStrategy: mockedAutoScaling,
    resources: mockedGPUResources,
  },
};

export const mockedAppSpecInput: ai.app.AppSpecInput = {
  name: 'myNewApp',
  region: 'GRA',
  image: 'myImage',
  defaultHttpPort: 8080,
  resources: { flavor: 'ai1-1-cpu', cpu: 2 },
  unsecureHttp: false,
  labels: {
    test: 'testLabel',
  },
  command: ['command', 'docker'],
  volumes: [mockedS3Volume, mockedGitVolume],
  scalingStrategy: mockedAutoScaling,
  probe: {
    path: '/health',
    port: 8080,
  },
};

export const mockedAppSpecInputGPU: ai.app.AppSpecInput = {
  name: 'myNewApp',
  region: 'GRA',
  unsecureHttp: false,
  labels: {
    test: 'testLabel',
  },
  probe: {
    path: '/health',
    port: 8080,
  },
  command: ['command', 'docker'],
  image: 'sentiment-analysis-app:1',
  partnerId: 'lettria',
  resources: { flavor: 'ai1-1-gpu', gpu: 2 },
  volumes: [mockedPublicGitVolume],
  scalingStrategy: mockedFixedScaling,
};
