import { ai } from '@/types/ai';

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
};

export const mockedAppStatus: ai.app.AppStatus = {
  availableReplicas: 2,
  dataSync: [
    {
      createdAt: 'createdAt',
      id: 'datasyncId',
      spec: {
        direction: ai.volume.DataSyncEnum.pull,
        manual: true,
      },
      status: {
        info: {
          code: ai.InfoCodeEnum.APP_RUNNING,
          message: 'message',
        },
        progress: [
          {
            completed: 1,
            createdAt: 'createdAt',
            deleted: 0,
            direction: ai.volume.DataSyncEnum.push,
            failed: 0,
            id: 'progressId',
            info: 'info',
            processed: 3,
            skipped: 1,
            state: ai.volume.DataSyncProgressStateEnum.DONE,
            total: 2,
            transferredBytes: 30,
            updatedAt: 'updatedAt',
          },
        ],
        queuedAt: 'queuedAt',
        state: ai.volume.DataSyncStateEnum.DONE,
      },
      updatedAt: 'updatedAt',
    },
  ],
  history: [
    {
      date: 'date',
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
