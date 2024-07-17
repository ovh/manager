import { ai } from '@/types/ai';

export const mockedJobSpec: ai.job.JobSpec = {
  image: 'image',
  name: 'name',
  region: 'region',
  resources: {
    cpu: 1,
    ephemeralStorage: 1,
    flavor: 'flavor',
    gpu: 1,
    memory: 1,
    privateNetwork: 1,
    publicNetwork: 1,
  },
};
export const mockedJobStatus: ai.job.JobStatus = {
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
      state: ai.job.JobStateEnum.DONE,
    },
  ],
  info: {
    code: ai.InfoCodeEnum.JOB_DONE,
    message: 'message',
  },
};
export const mockedJob: ai.job.Job = {
  createdAt: 'createdAt',
  id: 'jobId',
  spec: mockedJobSpec,
  status: mockedJobStatus,
  updatedAt: 'updatedAt',
  user: 'user',
};
