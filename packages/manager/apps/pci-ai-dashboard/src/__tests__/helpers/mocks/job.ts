import * as ai from '@/types/cloud/project/ai';
import { mockedDataSync } from './datasync';

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
  dataSync: [mockedDataSync],
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
